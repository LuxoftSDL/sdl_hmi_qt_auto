/*
 * Copyright (c) 2013, Ford Motor Company All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met: ·
 * Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer. · Redistributions in binary
 * form must reproduce the above copyright notice, this list of conditions and
 * the following disclaimer in the documentation and/or other materials provided
 * with the distribution. · Neither the name of the Ford Motor Company nor the
 * names of its contributors may be used to endorse or promote products derived
 * from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
/**
 * @name SDL.AppModel
 * @desc Abstarct model for SDL applications
 * @category Model
 * @filesource app/model/sdl/Abstract/AppModel.js
 * @version 1.0
 */

SDL.ABSAppModel = Em.Object.extend(
  {
    /**
     * Flag to display/fide PLAY_PAUSE button on media screen
     * depends on BC.SubscribeButton request
     */
    PLAY_PAUSE: false,
    /**
     * Flag to display/fide SEEKLEFT button on media screen
     * depends on BC.SubscribeButton request
     */
    SEEKLEFT: false,
    /**
     * Flag to display/fide SEEKRIGHT button on media screen
     * depends on BC.SubscribeButton request
     */
    SEEKRIGHT: false,
    /**
     * Flag to display/fide TUNEUP button on media screen
     * depends on BC.SubscribeButton request
     */
    TUNEUP: false,
    /**
     * Flag to display/fide TUNEDOWN button on media screen
     * depends on BC.SubscribeButton request
     */
    TUNEDOWN: false,
    /**
     * mediaPlayerIndicator flag for SDL.SDLMediaControlls view
     */
    mediaPlayerIndicator: 0,
    playIndicator: function() {
      return this.mediaPlayerIndicator ===
        SDL.SDLModel.data.mediaPlayerIndicatorEnum.PLAY;
    }.property('this.mediaPlayerIndicator'),
    pauseIndicator: function() {
      return this.mediaPlayerIndicator ===
        SDL.SDLModel.data.mediaPlayerIndicatorEnum.PAUSE;
    }.property('this.mediaPlayerIndicator'),
    playPauseIndicator: function() {
      return this.mediaPlayerIndicator ===
        SDL.SDLModel.data.mediaPlayerIndicatorEnum.PLAY_PAUSE;
    }.property('this.mediaPlayerIndicator'),
    bufferingIndicator: function() {
      return this.mediaPlayerIndicator ===
      SDL.SDLModel.data.mediaPlayerIndicatorEnum.BUFFERING ? 'BUFFERING' : null;
    }.property('this.mediaPlayerIndicator'),
    /**
     * Application's container for current processed requests on HMI
     *
     * @type {Object}
     */
    activeRequests: {},
    /**
     * Application Id
     *
     * @type {Number}
     */
    appID: null,
    /**
     * Application name
     *
     * @type {String}
     */
    appName: '',
    /**
     * Flag to define if application was initialized (registered) correctly
     * Has correct application type
     *
     * @type {Boolean}
     */
    initialized: false,
    /**
     * Current HMI level of registered application
     */
    level: 'NONE',
    /**
     * Media application flag
     * If application was successfully initialized this flag it set into
     * correct value
     *
     * @type {Boolean}
     */
    isMedia: null,
    /**
     * Flag to determine if app in application list can not be activated from
     * HMI
     *
     * @type {Boolean}
     */
    disabledToActivate: false,
    /**
     * Application type
     * If application was successfully initialized this parameter it set into
     * correct value
     *
     * @type {String}
     */
    appType: '',
    /**
     * Navigation streaming url
     */
    navigationStream: null,
    /**
     * Navigation streaming url
     */
    navigationAudioStream: null,
    /**
     * Chosen device name
     *
     * @type {String}
     */
    deviceName: '',
    /**
     * Chosen device id
     *
     * @type {String}
     */
    deviceID: null,
    /**
     * Global properties for current application
     *
     * @type {Object}
     */
    globalProperties: {},
    /**
     * Statusbar text
     *
     * @type {String}
     */
    statusText: '',
    /**
     * Info data
     *
     * @type: {Em.Object}
     */
    appInfo: null,
    /**
     * Current language of applications UI component
     *
     * @type {String}
     */
    UILanguage: 'EN-US',
    /**
     * Current language of applications TTS and applications VR component
     *
     * @type {String}
     */
    TTSVRLanguage: 'EN-US',
    /**
     * List of VR commands
     */
    VRCommands: [],
    /**
     * Array of Soft Buttons
     *
     * @type {Array}
     */
    softButtons: [],
    /**
     * Array of Soft Buttons
     *
     * @type {Array}
     */
    turnListSoftButtons: [],
    /**
     * Array of Objects for TBTTurnList
     *
     * @type {Array}
     */
    turnList: [],
    /**
     * Policies
     * Array of avaliable permission codes for current app
     * came from SDLCore in SDL.GetListOfPermissions response
     *
     * @type {Array}
     */
    allowedFunctions: [],
    /**
     * URL to application Icon
     *
     * @type {String}
     */
    appIcon: 'images/info/info_leftMenu_apps_ico.png',
    /**
     * Application commands list
     *
     * @type {Array}
     */
    commandsList: {
      0: []
    },
    /**
     * Flag to open ShowConstantTBTview when entering to current screen
     *
     * @type {Boolean}
     */
    tbtActivate: false,
    /**
     * Return current menu commands
     *
     * @return {Array}
     */
    currentCommandsList: function() {
      return this.get('commandsList.' + this.get('currentSubMenuId'));
    }.property('this.currentSubMenuId'),
    /**
     * Current command submenu identificator
     *
     * @type {Number}
     */
    currentSubMenuId: 'top',
    /**
     * Return current submenu name
     *
     * @return {String}
     */
    currentSubMenuLabel: function() {

      //Param "top" is Top level menu index
      var submenu, commands = this.commandsList['top'];
      for (var i = 0; i < commands.length; i++) {
        if (commands[i].menuID == this.currentSubMenuId) {
          submenu = commands[i].name;
        }
      }
      return this.get('currentSubMenuId') != 'top' ? submenu : 'Options';
    }.property('this.currentSubMenuId'),
    /**
     * Interaction chooses data
     *
     * @type {Object}
     */
    interactionChoices: {},
    /**
     * Method to remove deleted by SDL Core images used in HMI
     *
     * @param imageName
     */
    onImageRemoved: function(imageName) {
      var result = false;
      // Get list of subMenus with commands
      for (var commands in this.commandsList) {

        // Check if object item (subMenu list of commands) is added list with
        // command in object and not an inherited method of object
        if (this.commandsList.hasOwnProperty(commands)) {
          var len = this.commandsList[commands].length;
          for (var i = 0; i < len; i++) {

            // Check image name with each command in each subMenu
            if (this.commandsList[commands][i].icon) {
              if (this.commandsList[commands][i].icon.indexOf(imageName) !=
                -1 &&
                imageName.length ==
                this.commandsList[commands][i].icon.length) {

                // If found same image path than set default icon path
                this.commandsList[commands][i].icon =
                  SDL.SDLModel.data.defaultListOfIcons.command;
                result = true;
              }
            }
          }
        }
      }
      return result;
    },
    /**
     * Update Soft Buttons will handle on command Show
     *
     * @param {Array}
     */
    updateSoftButtons: function(buttons) {

      // delete existing buttons from array
      this.softButtons.splice(0);
      // push new buttons to array
      this.get('softButtons').pushObjects(buttons);
    },
    /**
     * Add command to list
     *
     * @param {Object}
     */
    addCommand: function(request) {
        var parentID = request.params.menuParams.parentID > 0 ?
            request.params.menuParams.parentID : 'top';
        if (!this.get('commandsList.' + parentID)) {
            this.commandsList[parentID] = [];
        }
        var commands = this.get('commandsList.' + parentID);
        // Magic number is limit of 1000 commands added on one menu
        result = FFW.RPCHelper.getCustomResultCode(this.appID, 'uiAddCommand');
      
        if (FFW.RPCHelper.isSuccessResultCode(result)) {
    	    if (commands.length <= 999) {
        		commands[commands.length] = {
        		  commandID: request.params.cmdID,
        		  name: request.params.menuParams.menuName,
        		  parent: parentID,
        		  position: request.params.menuParams.position ?
        		  request.params.menuParams.position : 0,
        		  isTemplate:request.params.cmdIcon ?
        		  request.params.cmdIcon.isTemplate ?request.params.cmdIcon.isTemplate : null
        		  : null,
        		  icon: request.params.cmdIcon ? request.params.cmdIcon.value : null
        		};
        		if (SDL.SDLController.getApplicationModel(request.params.appID) &&
                    SDL.OptionsView.active) {
                        SDL.SDLController.buttonsSort(parentID, this.appID);
                        SDL.OptionsView.commands.refreshItems();
        		}

    		    console.log(commands.length);
    		    if(request.params.cmdIcon) {
    	            var image = request.params.cmdIcon.value;
    		        var length=image.length;
            		str='.png';
            		var isPng=image.includes(str,length-5);
            		if (!isPng) {
            		    FFW.UI.sendUIResult(
            		        SDL.SDLModel.data.resultCode.WARNINGS, request.id,
            		        request.method
            		    );
            		    return;
    		        }
    	        }
        		if (request.id >= 0) {
        		  FFW.UI.sendUIResult(result, request.id, request.method);
        		}
    	    } else {
        		FFW.UI.sendError(
        		  result, request.id,
        		  request.method,
        		  'Adding more than 1000 item to the top menu or to submenu is not allowed.'
        		);
    	    }
    	} else {
            FFW.UI.sendError(
              result, request.id,
              request.method,
              'Erroneous response is assigned by settings'
            );
        }
    },
    /**
     * Delete command from list
     *
     * @param {Number}
     */
    deleteCommand: function(commandID, requestID) {
      for (var i in this.commandsList) {
        if (this.commandsList[i].filterProperty(
            'commandID', commandID
          ).length) {
          if (i != this.currentSubMenuId || this.currentSubMenuId == 'top') {
            this.get('commandsList.' + i).removeObjects(
              this.get('commandsList.' + i).filterProperty(
                'commandID', commandID
              )
            );
            SDL.SDLModel.deleteCommandResponse(
              SDL.SDLModel.data.resultCode.SUCCESS, requestID
            );
            return;
          } else {
            SDL.SDLModel.deleteCommandResponse(
              SDL.SDLModel.data.resultCode['IN_USE'], requestID
            );
            return;
          }
        }
      }
    },
    /**
     * Add submenu to commands list
     *
     * @param {Object}
     */
    addSubMenu: function(request) {

        // parentID is equal to 'top' cause Top level menu ID
        var parentID = 'top';
        var commands = this.get('commandsList.' + parentID);

        result = FFW.RPCHelper.getCustomResultCode(this.appID, 'AddSubmenu');
        if(FFW.RPCHelper.isSuccessResultCode(result)) {
    	    // Magic number is limit of 1000 commands added on one menu
    	    if (commands.length <= 999) {
        		this.commandsList[request.params.menuID] = [];
        		commands[commands.length] = {
        		  menuID: request.params.menuID,
        		  name: request.params.menuParams.menuName ?
        		    request.params.menuParams.menuName : '',
        		  parent: 0,
        		  position: request.params.menuParams.position ?
        		    request.params.menuParams.position : 0,
        		  icon: request.params.menuIcon ? request.params.menuIcon.value : null
        		};
        		if (SDL.SDLController.getApplicationModel(request.params.appID) &&
        		  SDL.OptionsView.active) {
        		    SDL.SDLController.buttonsSort(parentID, this.appID);
        		    SDL.OptionsView.commands.refreshItems();
        		}
        		FFW.UI.sendUIResult(result, request.id, request.method);
    	    } else {
        		FFW.UI.sendError(
        		  SDL.SDLModel.data.resultCode.REJECTED, request.id,
        		  request.method,
        		  'Adding more than 1000 item to the top menu or to submenu is not allowed.'
        		);
    	    }
    	} else {
            FFW.UI.sendError(
              result, request.id,
              request.method,
              'Erroneous response is assigned by settings'
            );
        }
    },
    /**
     * Delete submenu and related commands from list
     *
     * @param {Number}
     */
    deleteSubMenu: function(menuID) {
      if (this.commandsList['top'].filterProperty('commandID', menuID)) {
        this.get('commandsList.top').removeObjects(
          this.get('commandsList.top').filterProperty('menuID', menuID)
        );
        //delete(this.commandsList[menuID]);
      }
      return SDL.SDLModel.data.resultCode.SUCCESS;
    },
    /**
     * SDL UI CreateInteraction response handeler push set of commands to
     * voice recognition list
     *
     * @param {Object}
     */
    onCreateInteraction: function(message) {
      this.interactionChoices[message.interactionChoiceSetID] =
        message.choiceSet;
    },
    /**
     * SDL UI DeleteInteraction response handeler close current interaction
     * set window (if opened) and delete current set commands from voice
     * recognition list
     *
     * @param {Object}
     */
    onDeleteInteraction: function(message) {
      delete this.interactionChoices[message.interactionChoiceSetID];
    },
    /**
     * SDL UI Slider response handeler open Slider window with received
     * parameters
     *
     * @param {Object}
     */
    onSlider: function(message) {
      SDL.SliderView.loadData(message);
      SDL.SliderView.activate(this.appName, message.params.timeout);
    }
  }
);
