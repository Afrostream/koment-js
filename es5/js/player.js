/**
 * @file player.js
 */
// Subclasses Component
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _component = require('./component');

var _component2 = _interopRequireDefault(_component);

var _globalDocument = require('global/document');

var _globalDocument2 = _interopRequireDefault(_globalDocument);

var _globalWindow = require('global/window');

var _globalWindow2 = _interopRequireDefault(_globalWindow);

var _utilsEvents = require('./utils/events');

var Events = _interopRequireWildcard(_utilsEvents);

var _utilsDom = require('./utils/dom');

var Dom = _interopRequireWildcard(_utilsDom);

var _utilsFn = require('./utils/fn');

var Fn = _interopRequireWildcard(_utilsFn);

var _utilsGuid = require('./utils/guid');

var Guid = _interopRequireWildcard(_utilsGuid);

var _utilsBrowser = require('./utils/browser');

var browser = _interopRequireWildcard(_utilsBrowser);

var _utilsLog = require('./utils/log');

var _utilsLog2 = _interopRequireDefault(_utilsLog);

var _utilsStylesheet = require('./utils/stylesheet');

var stylesheet = _interopRequireWildcard(_utilsStylesheet);

var _fullscreenApi = require('./fullscreen-api');

var _fullscreenApi2 = _interopRequireDefault(_fullscreenApi);

var _mediaError = require('./media-error');

var _mediaError2 = _interopRequireDefault(_mediaError);

var _safeJsonParseTuple = require('safe-json-parse/tuple');

var _safeJsonParseTuple2 = _interopRequireDefault(_safeJsonParseTuple);

var _objectAssign = require('object.assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _utilsMergeOptions = require('./utils/merge-options');

var _utilsMergeOptions2 = _interopRequireDefault(_utilsMergeOptions);

var _utilsTimeRangesJs = require('./utils/time-ranges.js');

var _modalDialog = require('./modal-dialog');

var _modalDialog2 = _interopRequireDefault(_modalDialog);

var _techTech = require('./tech/tech');

var _techTech2 = _interopRequireDefault(_techTech);

var _lodash = require('lodash');

// The following imports are used only to ensure that the corresponding modules
// are always included in the video.js package. Importing the modules will
// execute them and they will register themselves with video.js.

require('./control-bar/control-bar');

require('./control-bar/progress-control/progress-control');

require('./component/koment-display');

require('./component/koment-list');

require('./tech/videojs');

require('./tech/html5');

require('./tech/youtube');

/**
 * An instance of the `Player` class is created when any of the Video.js setup methods are used to initialize a video.
 * ```js
 * var myPlayer = koment('example_video_1');
 * ```
 * In the following example, the `data-setup` attribute tells the Video.js library to create a player instance when the library is ready.
 * ```html
 * <video id="example_video_1" data-setup='{}' controls>
 *   <source src="my-source.mp4" type="video/mp4">
 * </video>
 * ```
 * After an instance has been created it can be accessed globally using `Video('example_video_1')`.
 *
 * @param {Element} tag        The original video tag used for configuring options
 * @param {Object=} options    Object of option names and values
 * @param {Function=} ready    Ready callback function
 * @extends Component
 * @class Player
 */

var Player = (function (_Component) {
  _inherits(Player, _Component);

  /**
   * player's constructor function
   *
   * @constructs
   * @method init
   * @param {Element} tag        The original video tag used for configuring options
   * @param {Object=} options    Player options
   * @param {Function=} ready    Ready callback function
   */

  function Player(tag, options, ready) {
    var _this = this;

    _classCallCheck(this, Player);

    // Make sure tag ID exists
    tag.id = tag.id || 'koment_video_' + Guid.newGUID();

    // Set Options
    // The options argument overrides options set in the video tag
    // which overrides globally set options.
    // This latter part coincides with the load order
    // (tag must exist before Player)
    options = (0, _objectAssign2['default'])(Player.getTagSettings(tag), options);

    // Delay the initialization of children because we need to set up
    // player properties first, and can't use `this` before `super()`
    options.initChildren = false;

    // Same with creating the element
    options.createEl = false;

    // we don't want the player to report touch activity on itself
    // see enableTouchActivity in Component
    options.reportTouchActivity = false;

    // If language is not set, get the closest lang attribute
    if (!options.language) {
      if (typeof tag.closest === 'function') {
        var closest = tag.closest('[lang]');

        if (closest) {
          options.language = closest.getAttribute('lang');
        }
      } else {
        var element = tag;

        while (element && element.nodeType === 1) {
          if (Dom.getElAttributes(element).hasOwnProperty('lang')) {
            options.language = element.getAttribute('lang');
            break;
          }
          element = element.parentNode;
        }
      }
    }

    // Run base component initializing with new options
    _get(Object.getPrototypeOf(Player.prototype), 'constructor', this).call(this, null, options, ready);

    // Store the original tag used to set options
    this.tag = tag;

    // Store the tag attributes used to restore html5 element
    this.tagAttributes = tag && Dom.getElAttributes(tag);

    // Update current language
    this.language(this.options_.language);

    // Update Supported Languages
    if (options.languages) {
      (function () {
        // Normalise player option languages to lowercase
        var languagesToLower = {};

        Object.getOwnPropertyNames(options.languages).forEach(function (name) {
          languagesToLower[name.toLowerCase()] = options.languages[name];
        });
        _this.languages_ = languagesToLower;
      })();
    } else {
      this.languages_ = Player.prototype.options_.languages;
    }

    // Cache for video property values.
    this.cache_ = {};

    // Set controls
    this.controls_ = !this.tag.controls;

    // Original tag settings stored in options
    // now remove immediately so native controls don't flash.
    // May be turned back on by HTML5 tech if nativeControlsForTouch is true
    //tag.controls = false;

    /*
     * Store the internal state of scrubbing
     *
     * @private
     * @return {Boolean} True if the user is scrubbing
     */
    this.scrubbing_ = false;

    this.el_ = this.createEl();

    // We also want to pass the original player options to each component and plugin
    // as well so they don't need to reach back into the player for options later.
    // We also need to do another copy of this.options_ so we don't end up with
    // an infinite loop.
    var playerOptionsCopy = (0, _utilsMergeOptions2['default'])(this.options_);

    // Load plugins
    if (options.plugins) {
      (function () {
        var plugins = options.plugins;

        Object.getOwnPropertyNames(plugins).forEach(function (name) {
          if (typeof this[name] === 'function') {
            this[name](plugins[name]);
          } else {
            _utilsLog2['default'].error('Unable to find plugin:', name);
          }
        }, _this);
      })();
    }

    this.options_.playerOptions = playerOptionsCopy;

    this.initChildren();

    // Update controls className. Can't do this when the controls are initially
    // set because the element doesn't exist yet.
    if (this.controls()) {
      this.addClass('koment-controls-enabled');
    } else {
      this.addClass('koment-controls-disabled');
    }

    // Set ARIA label and region role depending on player type
    this.el_.setAttribute('role', 'region');
    this.el_.setAttribute('aria-label', 'video player');

    if (this.flexNotSupported_()) {
      this.addClass('koment-no-flex');
    }

    // iOS Safari has broken hover handling
    if (!browser.IS_IOS) {
      this.addClass('koment-workinghover');
    }

    // Make player easily findable by ID
    Player.players[this.id_] = this;

    // When the player is first initialized, trigger activity so components
    // like the control bar show themselves if needed
    this.userActive(true);
    this.reportUserActivity();
    this.listenForUserActivity_();

    this.on('fullscreenchange', this.handleFullscreenChange_);
    this.on('stageclick', this.handleStageClick_);

    this.sourceList_();
  }

  /*
   * Global player list
   *
   * @type {Object}
   */

  /**
   * Destroys the video player and does any necessary cleanup
   * ```js
   *     myPlayer.dispose();
   * ```
   * This is especially helpful if you are dynamically adding and removing videos
   * to/from the DOM.
   *
   * @method dispose
   */

  _createClass(Player, [{
    key: 'dispose',
    value: function dispose() {
      this.trigger('dispose');
      // prevent dispose from being called twice
      this.off('dispose');

      if (this.styleEl_ && this.styleEl_.parentNode) {
        this.styleEl_.parentNode.removeChild(this.styleEl_);
      }

      // Kill reference to this player
      Player.players[this.id_] = null;

      if (this.tag && this.tag.koment) {
        this.tag.koment = null;
      }

      if (this.el_ && this.el_.koment) {
        this.el_.koment = null;
      }

      if (this.tech_) {
        this.tech_.dispose();
      }

      _get(Object.getPrototypeOf(Player.prototype), 'dispose', this).call(this);
    }

    /**
     * Create the component's DOM element
     *
     * @return {Element}
     * @method createEl
     */
  }, {
    key: 'createEl',
    value: function createEl() {
      var el = this.el_ = _get(Object.getPrototypeOf(Player.prototype), 'createEl', this).call(this, 'div');
      var tag = this.tag;

      // Remove width/height attrs from tag so CSS can make it 100% width/height
      //tag.removeAttribute('width');
      //tag.removeAttribute('height');

      // Copy over all the attributes from the tag, including ID and class
      // ID will now reference player box, not the video tag
      var attrs = Dom.getElAttributes(tag);

      Object.getOwnPropertyNames(attrs).forEach(function (attr) {
        // workaround so we don't totally break IE7
        // http://stackoverflow.com/questions/3653444/css-styles-not-applied-on-dynamic-elements-in-internet-explorer-7
        if (attr === 'class') {
          el.className = attrs[attr];
        } else {
          el.setAttribute(attr, attrs[attr]);
        }
      });

      // Update tag id/class for use as HTML5 playback tech
      // Might think we should do this after embedding in container so .koment-tech class
      // doesn't flash 100% width/height, but class only applies with .video-js parent
      tag.playerId = tag.id;
      tag.id += '_html5_api';
      tag.className = 'koment-tech';

      // Make player findable on elements
      tag.koment = el.koment = this;
      // Default state of video is paused
      this.addClass('koment');
      this.addClass('koment-paused');

      // Add a style element in the player that we'll use to set the width/height
      // of the player in a way that's still overrideable by CSS, just like the
      // video element
      if (_globalWindow2['default'].koment_NO_DYNAMIC_STYLE !== true) {
        this.styleEl_ = stylesheet.createStyleElement('koment-styles-dimensions');
        var defaultsStyleEl = Dom.$('.koment-styles-defaults');
        var head = Dom.$('head');

        head.insertBefore(this.styleEl_, defaultsStyleEl ? defaultsStyleEl.nextSibling : head.firstChild);
      }

      // Pass in the width/height/aspectRatio options which will update the style el
      this.width(this.options_.width);
      this.height(this.options_.height);
      this.fluid(this.options_.fluid);
      this.aspectRatio(this.options_.aspectRatio);

      // Hide any links within the video/audio tag, because IE doesn't hide them completely.
      var links = tag.getElementsByTagName('a');

      for (var i = 0; i < links.length; i++) {
        var linkEl = links.item(i);

        Dom.addElClass(linkEl, 'koment-hidden');
        linkEl.setAttribute('hidden', 'hidden');
      }

      // insertElFirst seems to cause the networkState to flicker from 3 to 2, so
      // keep track of the original for later so we can know if the source originally failed
      tag.initNetworkState_ = tag.networkState;

      // Wrap video tag in div (el/box) container
      if (tag.parentNode) {
        tag.parentNode.insertBefore(el, tag);
      }

      // insert the tag as the first child of the player element
      // then manually add it to the children array so that this.addChild
      // will work properly for other components
      //
      // Breaks iPhone, fixed in HTML5 setup.
      Dom.insertElFirst(tag, el);
      this.children_.unshift(tag);

      this.el_ = el;

      return el;
    }

    /**
     * Get/set player width
     *
     * @param {Number=} value Value for width
     * @return {Number} Width when getting
     * @method width
     */
  }, {
    key: 'width',
    value: function width(value) {
      return this.dimension('width', value);
    }

    /**
     * Get/set player height
     *
     * @param {Number=} value Value for height
     * @return {Number} Height when getting
     * @method height
     */
  }, {
    key: 'height',
    value: function height(value) {
      return this.dimension('height', value);
    }

    /**
     * Get/set dimension for player
     *
     * @param {String} dimension Either width or height
     * @param {Number=} value Value for dimension
     * @return {Component}
     * @method dimension
     */
  }, {
    key: 'dimension',
    value: function dimension(_dimension, value) {
      var privDimension = _dimension + '_';

      if (value === undefined) {
        return this[privDimension] || 0;
      }

      if (value === '') {
        // If an empty string is given, reset the dimension to be automatic
        this[privDimension] = undefined;
      } else {
        var parsedVal = parseFloat(value);

        if (isNaN(parsedVal)) {
          _utilsLog2['default'].error('Improper value "' + value + '" supplied for for ' + _dimension);
          return this;
        }

        this[privDimension] = parsedVal;
      }

      this.updateStyleEl_();
      return this;
    }

    /**
     * Add/remove the koment-fluid class
     *
     * @param {Boolean} bool Value of true adds the class, value of false removes the class
     * @method fluid
     */
  }, {
    key: 'fluid',
    value: function fluid(bool) {
      if (bool === undefined) {
        return !!this.fluid_;
      }

      this.fluid_ = !!bool;

      if (bool) {
        this.addClass('koment-fluid');
      } else {
        this.removeClass('koment-fluid');
      }
    }

    /**
     * Get/Set the aspect ratio
     *
     * @param {String=} ratio Aspect ratio for player
     * @return aspectRatio
     * @method aspectRatio
     */
  }, {
    key: 'aspectRatio',
    value: function aspectRatio(ratio) {
      if (ratio === undefined) {
        return this.aspectRatio_;
      }

      // Check for width:height format
      if (!/^\d+\:\d+$/.test(ratio)) {
        throw new Error('Improper value supplied for aspect ratio. The format should be width:height, for example 16:9.');
      }
      this.aspectRatio_ = ratio;

      // We're assuming if you set an aspect ratio you want fluid mode,
      // because in fixed mode you could calculate width and height yourself.
      this.fluid(true);

      this.updateStyleEl_();
    }

    /**
     * Update styles of the player element (height, width and aspect ratio)
     *
     * @method updateStyleEl_
     */
  }, {
    key: 'updateStyleEl_',
    value: function updateStyleEl_() {
      if (_globalWindow2['default'].koment_NO_DYNAMIC_STYLE === true) {
        var _width = typeof this.width_ === 'number' ? this.width_ : this.options_.width;
        var _height = typeof this.height_ === 'number' ? this.height_ : this.options_.height;
        var techEl = this.tech_ && this.tech_.el();

        if (techEl) {
          if (_width >= 0) {
            techEl.width = _width;
          }
          if (_height >= 0) {
            techEl.height = _height;
          }
        }

        return;
      }

      var width = undefined;
      var height = undefined;
      var aspectRatio = undefined;
      var idClass = undefined;

      // The aspect ratio is either used directly or to calculate width and height.
      if (this.aspectRatio_ !== undefined && this.aspectRatio_ !== 'auto') {
        // Use any aspectRatio that's been specifically set
        aspectRatio = this.aspectRatio_;
      } else if (this.videoWidth()) {
        // Otherwise try to get the aspect ratio from the video metadata
        aspectRatio = this.videoWidth() + ':' + this.videoHeight();
      } else {
        // Or use a default. The video element's is 2:1, but 16:9 is more common.
        aspectRatio = '16:9';
      }

      // Get the ratio as a decimal we can use to calculate dimensions
      var ratioParts = aspectRatio.split(':');
      var ratioMultiplier = ratioParts[1] / ratioParts[0];

      if (this.width_ !== undefined) {
        // Use any width that's been specifically set
        width = this.width_;
      } else if (this.height_ !== undefined) {
        // Or calulate the width from the aspect ratio if a height has been set
        width = this.height_ / ratioMultiplier;
      } else {
        // Or use the video's metadata, or use the video el's default of 300
        width = this.videoWidth() || 300;
      }

      if (this.height_ !== undefined) {
        // Use any height that's been specifically set
        height = this.height_;
      } else {
        // Otherwise calculate the height from the ratio and the width
        height = width * ratioMultiplier;
      }

      // Ensure the CSS class is valid by starting with an alpha character
      if (/^[^a-zA-Z]/.test(this.id())) {
        idClass = 'dimensions-' + this.id();
      } else {
        idClass = this.id() + '-dimensions';
      }

      // Ensure the right class is still on the player for the style element
      this.addClass(idClass);

      stylesheet.setTextContent(this.styleEl_, '\n      .' + idClass + ' {\n        width: ' + width + 'px;\n        height: ' + height + 'px;\n      }\n\n      .' + idClass + '.koment-fluid {\n        padding-top: ' + ratioMultiplier * 100 + '%;\n      }\n    ');
    }
  }, {
    key: 'sourceList_',
    value: function sourceList_() {
      var sourceTech = this.selectSource();

      if (sourceTech) {
        this.loadTech_(sourceTech[0]);
      } else {
        // We need to wrap this in a timeout to give folks a chance to add error event handlers
        this.setTimeout(function () {
          this.error({ code: 4, message: this.localize(this.options_.notSupportedMessage) });
        }, 0);

        // we could not find an appropriate tech, but let's still notify the delegate that this is it
        // this needs a better comment about why this is needed
        this.triggerReady();
      }
    }

    /**
     * Load the Media Playback Technology (tech)
     * Load/Create an instance of playback technology including element and API methods
     * And append playback element in player div.
     *
     * @param {String} techName Name of the playback technology
     * @param {String} source Video source
     * @method loadTech_
     * @private
     */
  }, {
    key: 'loadTech_',
    value: function loadTech_(techName) {

      // Pause and remove current playback technology
      if (this.tech_) {
        this.unloadTech_();
      }

      this.techName_ = techName; //this.tag.tagName;
      // Turn off API access because we're loading a new tech that might load asynchronously
      this.isReady_ = false;

      // Grab tech-specific options from player options and add source and parent element to use.
      var techOptions = (0, _objectAssign2['default'])({
        'nativeControlsForTouch': this.options_.nativeControlsForTouch,
        'playerId': this.id(),
        'techId': this.id() + '_' + techName + '_api',
        'language': this.language()
      }, this.options_[techName.toLowerCase()]);

      if (this.tag) {
        techOptions.tag = this.tag;
      }

      // Initialize tech instance
      var TechComponent = _techTech2['default'].getTech(this.techName_);
      this.tech_ = new TechComponent(techOptions);

      // player.triggerReady is always async, so don't need this to be async
      this.tech_.ready(Fn.bind(this, this.handleTechReady_), true);
      // Listen to all HTML5-defined events and trigger them on the player
      this.on(this.tech_, 'loadstart', this.handleTechLoadStart_);
      this.on(this.tech_, 'waiting', this.handleTechWaiting_);
      this.on(this.tech_, 'canplay', this.handleTechCanPlay_);
      this.on(this.tech_, 'canplaythrough', this.handleTechCanPlayThrough_);
      this.on(this.tech_, 'playing', this.handleTechPlaying_);
      this.on(this.tech_, 'ended', this.handleTechEnded_);
      this.on(this.tech_, 'seeking', this.handleTechSeeking_);
      this.on(this.tech_, 'seeked', this.handleTechSeeked_);
      this.on(this.tech_, 'play', this.handleTechPlay_);
      this.on(this.tech_, 'pause', this.handleTechPause_);
      this.on(this.tech_, 'progress', this.handleTechProgress_);
      this.on(this.tech_, 'durationchange', this.handleTechDurationChange_);
      this.on(this.tech_, 'fullscreenchange', this.handleTechFullscreenChange_);
      this.on(this.tech_, 'error', this.handleTechError_);
      this.on(this.tech_, 'loadedmetadata', this.handleTechLoadedMetaData_);
      this.on(this.tech_, 'loadeddata', this.handleTechLoadedData_);
      this.on(this.tech_, 'timeupdate', this.handleTechTimeUpdate_);
      this.on(this.tech_, 'volumechange', this.handleTechVolumeChange_);
      this.on(this.tech_, 'loadedmetadata', this.updateStyleEl_);

      if (this.controls() && !this.usingNativeControls() && ! ~this.el_.className.indexOf('vjs-tech')) {
        this.addTechControlsListeners_();
      }

      //// Add the tech element in the DOM if it was not already there
      //// Make sure to not insert the original video element if using Html5
      //if (this.tech_.el().parentNode !== this.el() && (techName !== 'Html5' || !this.tag)) {
      //  Dom.insertElFirst(this.tech_.el(), this.el());
      //}

      // Get rid of the original video tag reference after the first tech is loaded
      if (this.tag) {
        this.tag.koment = null;
        this.tag = null;
      }
    }

    /**
     * Unload playback technology
     *
     * @method unloadTech_
     * @private
     */
  }, {
    key: 'unloadTech_',
    value: function unloadTech_() {
      // Save the current text tracks so that we can reuse the same text tracks with the next tech

      this.isReady_ = false;

      this.tech_.dispose();

      this.tech_ = false;
    }
  }, {
    key: 'selectSource',
    value: function selectSource() {
      var _this2 = this;

      var techs = (0, _lodash.map)(_techTech2['default'].techs_, function (tech) {
        return [tech.name, _techTech2['default'].getTech(tech.name) || _component2['default'].getComponent(tech.name)];
      }).filter(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2);

        var techName = _ref2[0];
        var tech = _ref2[1];

        // Check if the current tech is defined before continuing
        if (tech) {
          // Check if the browser supports this technology
          return tech.isSupported(_this2.tag);
        }

        _utilsLog2['default'].error('The "' + techName + '" tech is undefined. Skipped browser support check for that tech.');
        return false;
      });

      return techs && techs.length && techs[0];
    }

    /**
     * Return a reference to the current tech.
     * It will only return a reference to the tech if given an object with the
     * `IWillNotUseThisInPlugins` property on it. This is try and prevent misuse
     * of techs by plugins.
     *
     * @param {Object}
     * @return {Object} The Tech
     * @method tech
     */
  }, {
    key: 'tech',
    value: function tech(safety) {
      if (safety && safety.IWillNotUseThisInPlugins) {
        return this.tech_;
      }
      var errorText = '\n      Please make sure that you are not using this inside of a plugin.\n      To disable this alert and error, please pass in an object with\n      `IWillNotUseThisInPlugins` \n    ';

      _globalWindow2['default'].alert(errorText);
      throw new Error(errorText);
    }

    /**
     * Set up click and touch listeners for the playback element
     *
     * On desktops, a click on the video itself will toggle playback,
     * on a mobile device a click on the video toggles controls.
     * (toggling controls is done by toggling the user state between active and
     * inactive)
     * A tap can signal that a user has become active, or has become inactive
     * e.g. a quick tap on an iPhone movie should reveal the controls. Another
     * quick tap should hide them again (signaling the user is in an inactive
     * viewing state)
     * In addition to this, we still want the user to be considered inactive after
     * a few seconds of inactivity.
     * Note: the only part of iOS interaction we can't mimic with this setup
     * is a touch and hold on the video element counting as activity in order to
     * keep the controls showing, but that shouldn't be an issue. A touch and hold
     * on any controls will still keep the user active
     *
     * @private
     * @method addTechControlsListeners_
     */
  }, {
    key: 'addTechControlsListeners_',
    value: function addTechControlsListeners_() {
      // Make sure to remove all the previous listeners in case we are called multiple times.
      this.removeTechControlsListeners_();

      // Some browsers (Chrome & IE) don't trigger a click on a flash swf, but do
      // trigger mousedown/up.
      // http://stackoverflow.com/questions/1444562/javascript-onclick-event-over-flash-object
      // Any touch events are set to block the mousedown event from happening
      this.on(this.tech_, 'mousedown', this.handleTechClick_);

      // If the controls were hidden we don't want that to change without a tap event
      // so we'll check if the controls were already showing before reporting user
      // activity
      this.on(this.tech_, 'touchstart', this.handleTechTouchStart_);
      this.on(this.tech_, 'touchmove', this.handleTechTouchMove_);
      this.on(this.tech_, 'touchend', this.handleTechTouchEnd_);

      // The tap listener needs to come after the touchend listener because the tap
      // listener cancels out any reportedUserActivity when setting userActive(false)
      this.on(this.tech_, 'tap', this.handleTechTap_);
    }

    /**
     * Remove the listeners used for click and tap controls. This is needed for
     * toggling to controls disabled, where a tap/touch should do nothing.
     *
     * @method removeTechControlsListeners_
     * @private
     */
  }, {
    key: 'removeTechControlsListeners_',
    value: function removeTechControlsListeners_() {
      // We don't want to just use `this.off()` because there might be other needed
      // listeners added by techs that extend this.
      this.off(this.tech_, 'tap', this.handleTechTap_);
      this.off(this.tech_, 'touchstart', this.handleTechTouchStart_);
      this.off(this.tech_, 'touchmove', this.handleTechTouchMove_);
      this.off(this.tech_, 'touchend', this.handleTechTouchEnd_);
      this.off(this.tech_, 'mousedown', this.handleTechClick_);
    }

    /**
     * Player waits for the tech to be ready
     *
     * @method handleTechReady_
     * @private
     */
  }, {
    key: 'handleTechReady_',
    value: function handleTechReady_() {
      this.triggerReady();

      // Keep the same volume as before
      if (this.cache_.volume) {
        this.techCall_('setVolume', this.cache_.volume);
      }

      // Update the duration if available
      this.handleTechDurationChange_();
    }

    /**
     * Fired when the user agent begins looking for media data
     *
     * @private
     * @method handleTechLoadStart_
     */
  }, {
    key: 'handleTechLoadStart_',
    value: function handleTechLoadStart_() {
      // TODO: Update to use `emptied` event instead. See #1277.

      this.removeClass('koment-ended');

      // reset the error state
      this.error(null);

      // If it's already playing we want to trigger a firstplay event now.
      // The firstplay event relies on both the play and loadstart events
      // which can happen in any order for a new source
      if (!this.paused()) {
        this.trigger('loadstart');
        this.trigger('firstplay');
      } else {
        // reset the hasStarted state
        this.hasStarted(false);
        this.trigger('loadstart');
      }
    }

    /**
     * Add/remove the koment-has-started class
     *
     * @param {Boolean} hasStarted The value of true adds the class the value of false remove the class
     * @return {Boolean} Boolean value if has started
     * @private
     * @method hasStarted
     */
  }, {
    key: 'hasStarted',
    value: function hasStarted(_hasStarted) {

      if (_hasStarted !== undefined) {
        // only update if this is a new value
        if (this.hasStarted_ !== _hasStarted) {
          this.hasStarted_ = _hasStarted;
          if (_hasStarted) {
            this.addClass('koment-has-started');
            // trigger the firstplay event if this newly has played
            this.trigger('firstplay');
          } else {
            this.removeClass('koment-has-started');
          }
        }
        return this;
      }
      return !!this.hasStarted_;
    }

    /**
     * Fired whenever the media begins or resumes playback
     *
     * @private
     * @method handleTechPlay_
     */
  }, {
    key: 'handleTechPlay_',
    value: function handleTechPlay_() {
      this.removeClass('koment-ended');
      this.removeClass('koment-paused');
      this.addClass('koment-playing');

      // hide the poster when the user hits play
      // https://html.spec.whatwg.org/multipage/embedded-content.html#dom-media-play
      this.hasStarted(true);

      this.trigger('play');
    }

    /**
     * Fired whenever the media begins waiting
     *
     * @private
     * @method handleTechWaiting_
     */
  }, {
    key: 'handleTechWaiting_',
    value: function handleTechWaiting_() {
      var _this3 = this;

      this.addClass('koment-waiting');
      this.trigger('waiting');
      this.one('timeupdate', function () {
        return _this3.removeClass('koment-waiting');
      });
    }

    /**
     * A handler for events that signal that waiting has ended
     * which is not consistent between browsers. See #1351
     *
     * @private
     * @method handleTechCanPlay_
     */
  }, {
    key: 'handleTechCanPlay_',
    value: function handleTechCanPlay_() {
      this.removeClass('koment-waiting');
      this.trigger('canplay');
    }

    /**
     * A handler for events that signal that waiting has ended
     * which is not consistent between browsers. See #1351
     *
     * @private
     * @method handleTechCanPlayThrough_
     */
  }, {
    key: 'handleTechCanPlayThrough_',
    value: function handleTechCanPlayThrough_() {
      this.removeClass('koment-waiting');
      this.trigger('canplaythrough');
    }

    /**
     * A handler for events that signal that waiting has ended
     * which is not consistent between browsers. See #1351
     *
     * @private
     * @method handleTechPlaying_
     */
  }, {
    key: 'handleTechPlaying_',
    value: function handleTechPlaying_() {
      this.removeClass('koment-waiting');
      this.trigger('playing');
    }

    /**
     * Fired whenever the player is jumping to a new time
     *
     * @private
     * @method handleTechSeeking_
     */
  }, {
    key: 'handleTechSeeking_',
    value: function handleTechSeeking_() {
      this.addClass('koment-seeking');
      this.trigger('seeking');
    }

    /**
     * Fired when the player has finished jumping to a new time
     *
     * @private
     * @method handleTechSeeked_
     */
  }, {
    key: 'handleTechSeeked_',
    value: function handleTechSeeked_() {
      this.removeClass('koment-seeking');
      this.trigger('seeked');
    }

    /**
     * Fired the first time a video is played
     * Not part of the HLS spec, and we're not sure if this is the best
     * implementation yet, so use sparingly. If you don't have a reason to
     * prevent playback, use `myPlayer.one('play');` instead.
     *
     * @private
     * @method handleTechFirstPlay_
     */
  }, {
    key: 'handleTechFirstPlay_',
    value: function handleTechFirstPlay_() {
      // If the first starttime attribute is specified
      // then we will start at the given offset in seconds
      if (this.options_.starttime) {
        this.currentTime(this.options_.starttime);
      }

      this.addClass('koment-has-started');
      this.trigger('firstplay');
    }

    /**
     * Fired whenever the media has been paused
     *
     * @private
     * @method handleTechPause_
     */
  }, {
    key: 'handleTechPause_',
    value: function handleTechPause_() {
      this.removeClass('koment-playing');
      this.addClass('koment-paused');
      this.trigger('pause');
    }

    /**
     * Fired while the user agent is downloading media data
     *
     * @private
     * @method handleTechProgress_
     */
  }, {
    key: 'handleTechProgress_',
    value: function handleTechProgress_() {
      this.trigger('progress');
    }

    /**
     * Fired when the end of the media resource is reached (currentTime == duration)
     *
     * @private
     * @method handleTechEnded_
     */
  }, {
    key: 'handleTechEnded_',
    value: function handleTechEnded_() {
      this.addClass('koment-ended');
      if (this.options_.loop) {
        this.currentTime(0);
        this.play();
      } else if (!this.paused()) {
        this.pause();
      }

      this.trigger('ended');
    }

    /**
     * Fired when the duration of the media resource is first known or changed
     *
     * @private
     * @method handleTechDurationChange_
     */
  }, {
    key: 'handleTechDurationChange_',
    value: function handleTechDurationChange_() {
      this.duration(this.techGet_('duration'));
    }

    /**
     * Handle a click on the media element to play/pause
     *
     * @param {Object=} event Event object
     * @private
     * @method handleTechClick_
     */
  }, {
    key: 'handleTechClick_',
    value: function handleTechClick_(event) {
      // We're using mousedown to detect clicks thanks to Flash, but mousedown
      // will also be triggered with right-clicks, so we need to prevent that
      if (event.button !== 0) {
        return;
      }

      // When controls are disabled a click should not toggle playback because
      // the click is considered a control
      if (this.controls()) {
        if (this.paused()) {
          this.play();
        } else {
          this.pause();
        }
      }
    }

    /**
     * Handle a tap on the media element. It will toggle the user
     * activity state, which hides and shows the controls.
     *
     * @private
     * @method handleTechTap_
     */
  }, {
    key: 'handleTechTap_',
    value: function handleTechTap_() {
      this.userActive(!this.userActive());
    }

    /**
     * Handle touch to start
     *
     * @private
     * @method handleTechTouchStart_
     */
  }, {
    key: 'handleTechTouchStart_',
    value: function handleTechTouchStart_() {
      this.userWasActive = this.userActive();
    }

    /**
     * Handle touch to move
     *
     * @private
     * @method handleTechTouchMove_
     */
  }, {
    key: 'handleTechTouchMove_',
    value: function handleTechTouchMove_() {
      if (this.userWasActive) {
        this.reportUserActivity();
      }
    }

    /**
     * Handle touch to end
     *
     * @private
     * @method handleTechTouchEnd_
     */
  }, {
    key: 'handleTechTouchEnd_',
    value: function handleTechTouchEnd_(event) {
      // Stop the mouse events from also happening
      event.preventDefault();
    }

    /**
     * Fired when the player switches in or out of fullscreen mode
     *
     * @private
     * @method handleFullscreenChange_
     */
  }, {
    key: 'handleFullscreenChange_',
    value: function handleFullscreenChange_() {
      if (this.isFullscreen()) {
        this.addClass('koment-fullscreen');
      } else {
        this.removeClass('koment-fullscreen');
      }
    }

    /**
     * native click events on the SWF aren't triggered on IE11, Win8.1RT
     * use stageclick events triggered from inside the SWF instead
     *
     * @private
     * @method handleStageClick_
     */
  }, {
    key: 'handleStageClick_',
    value: function handleStageClick_() {
      this.reportUserActivity();
    }

    /**
     * Handle Tech Fullscreen Change
     *
     * @private
     * @method handleTechFullscreenChange_
     */
  }, {
    key: 'handleTechFullscreenChange_',
    value: function handleTechFullscreenChange_(event, data) {
      if (data) {
        this.isFullscreen(data.isFullscreen);
      }
      this.trigger('fullscreenchange');
    }

    /**
     * Fires when an error occurred during the loading of an audio/video
     *
     * @private
     * @method handleTechError_
     */
  }, {
    key: 'handleTechError_',
    value: function handleTechError_() {
      var error = this.tech_.error();

      this.error(error);
    }

    /**
     * Fires when the browser is intentionally not getting media data
     *
     * @private
     * @method handleTechSuspend_
     */
  }, {
    key: 'handleTechSuspend_',
    value: function handleTechSuspend_() {
      this.trigger('suspend');
    }

    /**
     * Fires when the loading of an audio/video is aborted
     *
     * @private
     * @method handleTechAbort_
     */
  }, {
    key: 'handleTechAbort_',
    value: function handleTechAbort_() {
      this.trigger('abort');
    }

    /**
     * Fires when the current playlist is empty
     *
     * @private
     * @method handleTechEmptied_
     */
  }, {
    key: 'handleTechEmptied_',
    value: function handleTechEmptied_() {
      this.trigger('emptied');
    }

    /**
     * Fires when the browser is trying to get media data, but data is not available
     *
     * @private
     * @method handleTechStalled_
     */
  }, {
    key: 'handleTechStalled_',
    value: function handleTechStalled_() {
      this.trigger('stalled');
    }

    /**
     * Fires when the browser has loaded meta data for the audio/video
     *
     * @private
     * @method handleTechLoadedMetaData_
     */
  }, {
    key: 'handleTechLoadedMetaData_',
    value: function handleTechLoadedMetaData_() {
      this.trigger('loadedmetadata');
    }
  }, {
    key: 'handleTechTextData_',
    value: function handleTechTextData_() {
      var data = null;

      if (arguments.length > 1) {
        data = arguments[1];
      }
      this.trigger('textdata', data);
    }

    /**
     * Fires when the browser has loaded the current frame of the audio/video
     *
     * @private
     * @method handleTechLoadedData_
     */
  }, {
    key: 'handleTechLoadedData_',
    value: function handleTechLoadedData_() {
      this.trigger('loadeddata');
    }

    /**
     * Fires when the current playback position has changed
     *
     * @private
     * @method handleTechTimeUpdate_
     */
  }, {
    key: 'handleTechTimeUpdate_',
    value: function handleTechTimeUpdate_() {
      this.trigger('timeupdate');
    }

    /**
     * Fires when the playing speed of the audio/video is changed
     *
     * @private
     * @method handleTechRateChange_
     */
  }, {
    key: 'handleTechRateChange_',
    value: function handleTechRateChange_() {
      this.trigger('ratechange');
    }

    /**
     * Fires when the volume has been changed
     *
     * @private
     * @method handleTechVolumeChange_
     */
  }, {
    key: 'handleTechVolumeChange_',
    value: function handleTechVolumeChange_() {
      this.trigger('volumechange');
    }

    /**
     * Fires when the text track has been changed
     *
     * @private
     * @method handleTechTextTrackChange_
     */
  }, {
    key: 'handleTechTextTrackChange_',
    value: function handleTechTextTrackChange_() {
      this.trigger('texttrackchange');
    }

    /**
     * Get object for cached values.
     *
     * @return {Object}
     * @method getCache
     */
  }, {
    key: 'getCache',
    value: function getCache() {
      return this.cache_;
    }

    /**
     * Pass values to the playback tech
     *
     * @param {String=} method Method
     * @param {Object=} arg Argument
     * @private
     * @method techCall_
     */
  }, {
    key: 'techCall_',
    value: function techCall_(method, arg) {
      // If it's not ready yet, call method when it is
      if (this.tech_ && !this.tech_.isReady_) {
        this.tech_.ready(function () {
          this[method](arg);
        }, true);

        // Otherwise call method now
      } else {
          try {
            if (this.tech_) {
              this.tech_[method](arg);
            }
          } catch (e) {
            (0, _utilsLog2['default'])(e);
            throw e;
          }
        }
    }

    /**
     * Get calls can't wait for the tech, and sometimes don't need to.
     *
     * @param {String} method Tech method
     * @return {Method}
     * @private
     * @method techGet_
     */
  }, {
    key: 'techGet_',
    value: function techGet_(method) {
      if (this.tech_ && this.tech_.isReady_) {

        // Flash likes to die and reload when you hide or reposition it.
        // In these cases the object methods go away and we get errors.
        // When that happens we'll catch the errors and inform tech that it's not ready any more.
        try {
          return this.tech_[method]();
        } catch (e) {
          // When building additional tech libs, an expected method may not be defined yet
          if (this.tech_[method] === undefined) {
            (0, _utilsLog2['default'])('Video.js: ' + method + ' method not defined for ' + this.techName_ + ' playback technology.', e);

            // When a method isn't available on the object it throws a TypeError
          } else if (e.name === 'TypeError') {
              (0, _utilsLog2['default'])('Video.js: ' + method + ' unavailable on ' + this.techName_ + ' playback technology element.', e);
              this.tech_.isReady_ = false;
            } else {
              (0, _utilsLog2['default'])(e);
            }
          throw e;
        }
      }

      return;
    }

    /**
     * start media playback
     * ```js
     *     myPlayer.play();
     * ```
     *
     * @return {Player} self
     * @method play
     */
  }, {
    key: 'play',
    value: function play() {
      // Only calls the tech's play if we already have a src loaded
      if (this.src() || this.currentSrc()) {
        this.techCall_('play');
      } else {
        this.tech_.one('loadstart', function () {
          this.play();
        });
      }

      return this;
    }
  }, {
    key: 'komentsList',
    value: function komentsList(list) {
      if (list !== undefined) {
        this.komentsList_ = list;
      }
      return this.komentsList_;
    }
  }, {
    key: 'isKomentOn',
    value: function isKomentOn() {
      return this.toggleMenu_;
    }
  }, {
    key: 'toggleMenu',
    value: function toggleMenu(toggle) {

      if (toggle !== undefined) {
        this.toggleMenu_ = !!toggle;
      } else {
        this.toggleMenu_ = !this.toggleMenu_;
      }

      if (this.toggleMenu_) {
        this.addClass('koment-toggle-menu');
      } else {
        this.removeClass('koment-toggle-menu');
        this.toggleEdit(this.toggleMenu_);
        this.toggleList(this.toggleMenu_);
      }

      this.trigger('togglemenu');
      return this;
    }
  }, {
    key: 'toggleEdit',
    value: function toggleEdit(toggle) {
      if (toggle !== undefined) {
        this.toggleEdit_ = !!toggle;
      } else {
        this.toggleEdit_ = !this.toggleEdit_;
      }

      if (this.toggleEdit_) {
        this.playBeforeEdit = !this.paused();
        this.pause();
        this.addClass('koment-toggle-edit');
      } else {
        if (this.playBeforeEdit) {
          this.play();
        }
        this.removeClass('koment-toggle-edit');
      }

      return this;
    }
  }, {
    key: 'toggleList',
    value: function toggleList(toggle) {
      if (toggle !== undefined) {
        this.toggleList_ = !!toggle;
      } else {
        this.toggleList_ = !this.toggleList_;
      }

      if (this.toggleList_) {
        this.addClass('koment-toggle-list');
      } else {
        this.removeClass('koment-toggle-list');
      }

      return this;
    }
  }, {
    key: 'sendKoment',
    value: function sendKoment(kmt) {
      if (!kmt || !kmt.message) {
        return;
      }
      console.log('koment send ', kmt);
      this.komentsList_.unshift(kmt);
      this.toggleEdit(false);
      this.trigger({ data: kmt, type: 'komentsupdated' });
    }

    /**
     * Pause the video playback
     * ```js
     *     myPlayer.pause();
     * ```
     *
     * @return {Player} self
     * @method pause
     */
  }, {
    key: 'pause',
    value: function pause() {
      this.techCall_('pause');
      return this;
    }

    /**
     * Check if the player is paused
     * ```js
     *     var isPaused = myPlayer.paused();
     *     var isPlaying = !myPlayer.paused();
     * ```
     *
     * @return {Boolean} false if the media is currently playing, or true otherwise
     * @method paused
     */
  }, {
    key: 'paused',
    value: function paused() {
      // The initial state of paused should be true (in Safari it's actually false)
      return this.techGet_('paused') === false ? false : true;
    }

    /**
     * Returns whether or not the user is "scrubbing". Scrubbing is when the user
     * has clicked the progress bar handle and is dragging it along the progress bar.
     *
     * @param  {Boolean} isScrubbing   True/false the user is scrubbing
     * @return {Boolean}               The scrubbing status when getting
     * @return {Object}                The player when setting
     * @method scrubbing
     */
  }, {
    key: 'scrubbing',
    value: function scrubbing(isScrubbing) {
      if (isScrubbing !== undefined) {
        this.scrubbing_ = !!isScrubbing;

        if (isScrubbing) {
          this.addClass('koment-scrubbing');
        } else {
          this.removeClass('koment-scrubbing');
        }

        return this;
      }

      return this.scrubbing_;
    }

    /**
     * Get or set the current time (in seconds)
     * ```js
     *     // get
     *     var whereYouAt = myPlayer.currentTime();
     *     // set
     *     myPlayer.currentTime(120); // 2 minutes into the video
     * ```
     *
     * @param  {Number|String=} seconds The time to seek to
     * @return {Number}        The time in seconds, when not setting
     * @return {Player}    self, when the current time is set
     * @method currentTime
     */
  }, {
    key: 'currentTime',
    value: function currentTime(seconds) {
      if (seconds !== undefined) {

        this.techCall_('setCurrentTime', seconds);

        return this;
      }

      // cache last currentTime and return. default to 0 seconds
      //
      // Caching the currentTime is meant to prevent a massive amount of reads on the tech's
      // currentTime when scrubbing, but may not provide much performance benefit afterall.
      // Should be tested. Also something has to read the actual current time or the cache will
      // never get updated.
      this.cache_.currentTime = this.techGet_('currentTime') || 0;
      return this.cache_.currentTime;
    }

    /**
     * Normally gets the length in time of the video in seconds;
     * in all but the rarest use cases an argument will NOT be passed to the method
     * ```js
     *     var lengthOfVideo = myPlayer.duration();
     * ```
     * **NOTE**: The video must have started loading before the duration can be
     * known, and in the case of Flash, may not be known until the video starts
     * playing.
     *
     * @param {Number} seconds Duration when setting
     * @return {Number} The duration of the video in seconds when getting
     * @method duration
     */
  }, {
    key: 'duration',
    value: function duration(seconds) {
      if (seconds === undefined) {
        return this.cache_.duration || 0;
      }

      seconds = parseFloat(seconds) || 0;

      // Standardize on Inifity for signaling video is live
      if (seconds < 0) {
        seconds = Infinity;
      }

      if (seconds !== this.cache_.duration) {
        // Cache the last set value for optimized scrubbing (esp. Flash)
        this.cache_.duration = seconds;

        if (seconds === Infinity) {
          this.addClass('koment-live');
        } else {
          this.removeClass('koment-live');
        }

        this.trigger('durationchange');
      }

      return this;
    }

    /**
     * Calculates how much time is left.
     * ```js
     *     var timeLeft = myPlayer.remainingTime();
     * ```
     * Not a native video element function, but useful
     *
     * @return {Number} The time remaining in seconds
     * @method remainingTime
     */
  }, {
    key: 'remainingTime',
    value: function remainingTime() {
      return this.duration() - this.currentTime();
    }

    // http://dev.w3.org/html5/spec/video.html#dom-media-buffered
    // Buffered returns a timerange object.
    // Kind of like an array of portions of the video that have been downloaded.

    /**
     * Get a TimeRange object with the times of the video that have been downloaded
     * If you just want the percent of the video that's been downloaded,
     * use bufferedPercent.
     * ```js
     *     // Number of different ranges of time have been buffered. Usually 1.
     *     numberOfRanges = bufferedTimeRange.length,
     *     // Time in seconds when the first range starts. Usually 0.
     *     firstRangeStart = bufferedTimeRange.start(0),
     *     // Time in seconds when the first range ends
     *     firstRangeEnd = bufferedTimeRange.end(0),
     *     // Length in seconds of the first time range
     *     firstRangeLength = firstRangeEnd - firstRangeStart;
     * ```
     *
     * @return {Object} A mock TimeRange object (following HTML spec)
     * @method buffered
     */
  }, {
    key: 'buffered',
    value: function buffered() {
      var buffered = this.techGet_('buffered');

      if (!buffered || !buffered.length) {
        buffered = (0, _utilsTimeRangesJs.createTimeRange)(0, 0);
      }

      return buffered;
    }

    /**
     * Get the percent (as a decimal) of the video that's been downloaded
     * ```js
     *     var howMuchIsDownloaded = myPlayer.bufferedPercent();
     * ```
     * 0 means none, 1 means all.
     * (This method isn't in the HTML5 spec, but it's very convenient)
     *
     * @return {Number} A decimal between 0 and 1 representing the percent
     * @method bufferedPercent
     */
  }, {
    key: 'bufferedPercent',
    value: (function (_bufferedPercent) {
      function bufferedPercent() {
        return _bufferedPercent.apply(this, arguments);
      }

      bufferedPercent.toString = function () {
        return _bufferedPercent.toString();
      };

      return bufferedPercent;
    })(function () {
      return bufferedPercent(this.buffered(), this.duration());
    })

    /**
     * Get the ending time of the last buffered time range
     * This is used in the progress bar to encapsulate all time ranges.
     *
     * @return {Number} The end of the last buffered time range
     * @method bufferedEnd
     */
  }, {
    key: 'bufferedEnd',
    value: function bufferedEnd() {
      var buffered = this.buffered();
      var duration = this.duration();
      var end = buffered.end(buffered.length - 1);

      if (end > duration) {
        end = duration;
      }

      return end;
    }

    // Check if current tech can support native fullscreen
    // (e.g. with built in controls like iOS, so not our flash swf)
    /**
     * Check to see if fullscreen is supported
     *
     * @return {Boolean}
     * @method supportsFullScreen
     */
  }, {
    key: 'supportsFullScreen',
    value: function supportsFullScreen() {
      return this.techGet_('supportsFullScreen') || false;
    }

    /**
     * Check if the player is in fullscreen mode
     * ```js
     *     // get
     *     var fullscreenOrNot = myPlayer.isFullscreen();
     *     // set
     *     myPlayer.isFullscreen(true); // tell the player it's in fullscreen
     * ```
     * NOTE: As of the latest HTML5 spec, isFullscreen is no longer an official
     * property and instead document.fullscreenElement is used. But isFullscreen is
     * still a valuable property for internal player workings.
     *
     * @param  {Boolean=} isFS Update the player's fullscreen state
     * @return {Boolean} true if fullscreen false if not when getting
     * @return {Player} self when setting
     * @method isFullscreen
     */
  }, {
    key: 'isFullscreen',
    value: function isFullscreen(isFS) {
      if (isFS !== undefined) {
        this.isFullscreen_ = !!isFS;
        return this;
      }
      return !!this.isFullscreen_;
    }

    /**
     * Increase the size of the video to full screen
     * ```js
     *     myPlayer.requestFullscreen();
     * ```
     * In some browsers, full screen is not supported natively, so it enters
     * "full window mode", where the video fills the browser window.
     * In browsers and devices that support native full screen, sometimes the
     * browser's default controls will be shown, and not the Video.js custom skin.
     * This includes most mobile devices (iOS, Android) and older versions of
     * Safari.
     *
     * @return {Player} self
     * @method requestFullscreen
     */
  }, {
    key: 'requestFullscreen',
    value: function requestFullscreen() {
      var fsApi = _fullscreenApi2['default'];

      this.isFullscreen(true);

      if (fsApi.requestFullscreen) {
        // the browser supports going fullscreen at the element level so we can
        // take the controls fullscreen as well as the video

        // Trigger fullscreenchange event after change
        // We have to specifically add this each time, and remove
        // when canceling fullscreen. Otherwise if there's multiple
        // players on a page, they would all be reacting to the same fullscreen
        // events
        Events.on(_globalDocument2['default'], fsApi.fullscreenchange, Fn.bind(this, function documentFullscreenChange(e) {
          this.isFullscreen(_globalDocument2['default'][fsApi.fullscreenElement]);

          // If cancelling fullscreen, remove event listener.
          if (this.isFullscreen() === false) {
            Events.off(_globalDocument2['default'], fsApi.fullscreenchange, documentFullscreenChange);
          }

          this.trigger('fullscreenchange');
        }));

        this.el_[fsApi.requestFullscreen]();
      } else if (this.tech_.supportsFullScreen()) {
        // we can't take the video.js controls fullscreen but we can go fullscreen
        // with native controls
        this.techCall_('enterFullScreen');
      } else {
        // fullscreen isn't supported so we'll just stretch the video element to
        // fill the viewport
        this.enterFullWindow();
        this.trigger('fullscreenchange');
      }

      return this;
    }

    /**
     * Return the video to its normal size after having been in full screen mode
     * ```js
     *     myPlayer.exitFullscreen();
     * ```
     *
     * @return {Player} self
     * @method exitFullscreen
     */
  }, {
    key: 'exitFullscreen',
    value: function exitFullscreen() {
      var fsApi = _fullscreenApi2['default'];

      this.isFullscreen(false);

      // Check for browser element fullscreen support
      if (fsApi.requestFullscreen) {
        _globalDocument2['default'][fsApi.exitFullscreen]();
      } else if (this.tech_.supportsFullScreen()) {
        this.techCall_('exitFullScreen');
      } else {
        this.exitFullWindow();
        this.trigger('fullscreenchange');
      }

      return this;
    }

    /**
     * When fullscreen isn't supported we can stretch the video container to as wide as the browser will let us.
     *
     * @method enterFullWindow
     */
  }, {
    key: 'enterFullWindow',
    value: function enterFullWindow() {
      this.isFullWindow = true;

      // Storing original doc overflow value to return to when fullscreen is off
      this.docOrigOverflow = _globalDocument2['default'].documentElement.style.overflow;

      // Add listener for esc key to exit fullscreen
      Events.on(_globalDocument2['default'], 'keydown', Fn.bind(this, this.fullWindowOnEscKey));

      // Hide any scroll bars
      _globalDocument2['default'].documentElement.style.overflow = 'hidden';

      // Apply fullscreen styles
      Dom.addElClass(_globalDocument2['default'].body, 'koment-full-window');

      this.trigger('enterFullWindow');
    }

    /**
     * Check for call to either exit full window or full screen on ESC key
     *
     * @param {String} event Event to check for key press
     * @method fullWindowOnEscKey
     */
  }, {
    key: 'fullWindowOnEscKey',
    value: function fullWindowOnEscKey(event) {
      if (event.keyCode === 27) {
        if (this.isFullscreen() === true) {
          this.exitFullscreen();
        } else {
          this.exitFullWindow();
        }
      }
    }

    /**
     * Exit full window
     *
     * @method exitFullWindow
     */
  }, {
    key: 'exitFullWindow',
    value: function exitFullWindow() {
      this.isFullWindow = false;
      Events.off(_globalDocument2['default'], 'keydown', this.fullWindowOnEscKey);

      // Unhide scroll bars.
      _globalDocument2['default'].documentElement.style.overflow = this.docOrigOverflow;

      // Remove fullscreen styles
      Dom.removeElClass(_globalDocument2['default'].body, 'koment-full-window');

      // Resize the box, controller, and poster to original sizes
      // this.positionAll();
      this.trigger('exitFullWindow');
    }
  }, {
    key: 'src',
    value: function src() {
      return this.techGet_('currentSrc');
    }

    /**
     * Returns the fully qualified URL of the current source value e.g. http://mysite.com/video.mp4
     * Can be used in conjuction with `currentType` to assist in rebuilding the current source object.
     *
     * @return {String} The current source
     * @method currentSrc
     */
  }, {
    key: 'currentSrc',
    value: function currentSrc() {
      return this.techGet_('currentSrc') || this.cache_.src || '';
    }

    /**
     * Get or set whether or not the controls are showing.
     *
     * @param  {Boolean} bool Set controls to showing or not
     * @return {Boolean}    Controls are showing
     * @method controls
     */
  }, {
    key: 'controls',
    value: function controls(bool) {
      if (bool !== undefined) {
        bool = !!bool;
        // Don't trigger a change event unless it actually changed
        if (this.controls_ !== bool) {
          this.controls_ = bool;

          if (this.usingNativeControls()) {
            this.techCall_('setControls', bool);
          }

          if (bool) {
            this.removeClass('koment-controls-disabled');
            this.addClass('koment-controls-enabled');
            this.trigger('controlsenabled');
            if (!this.usingNativeControls()) {
              this.addTechControlsListeners_();
            }
          } else {
            this.removeClass('koment-controls-enabled');
            this.addClass('koment-controls-disabled');
            this.trigger('controlsdisabled');

            if (!this.usingNativeControls()) {
              this.removeTechControlsListeners_();
            }
          }
        }
        return this;
      }
      return !!this.controls_;
    }

    /**
     * Toggle native controls on/off. Native controls are the controls built into
     * devices (e.g. default iPhone controls), Flash, or other techs
     * (e.g. Vimeo Controls)
     * **This should only be set by the current tech, because only the tech knows
     * if it can support native controls**
     *
     * @param  {Boolean} bool    True signals that native controls are on
     * @return {Player}      Returns the player
     * @private
     * @method usingNativeControls
     */
  }, {
    key: 'usingNativeControls',
    value: function usingNativeControls(bool) {
      if (bool !== undefined) {
        bool = !!bool;

        // Don't trigger a change event unless it actually changed
        if (this.usingNativeControls_ !== bool) {
          this.usingNativeControls_ = bool;
          if (bool) {
            this.addClass('koment-using-native-controls');

            /**
             * player is using the native device controls
             *
             * @event usingnativecontrols
             * @memberof Player
             * @instance
             * @private
             */
            this.trigger('usingnativecontrols');
          } else {
            this.removeClass('koment-using-native-controls');

            /**
             * player is using the custom HTML controls
             *
             * @event usingcustomcontrols
             * @memberof Player
             * @instance
             * @private
             */
            this.trigger('usingcustomcontrols');
          }
        }
        return this;
      }
      return !!this.usingNativeControls_;
    }

    /**
     * Set or get the current MediaError
     *
     * @param  {*} err A MediaError or a String/Number to be turned into a MediaError
     * @return {MediaError|null}     when getting
     * @return {Player}              when setting
     * @method error
     */
  }, {
    key: 'error',
    value: function error(err) {
      if (err === undefined) {
        return this.error_ || null;
      }

      // restoring to default
      if (err === null) {
        this.error_ = err;
        this.removeClass('koment-error');
        if (this.errorDisplay) {
          this.errorDisplay.close();
        }
        return this;
      }

      this.error_ = new _mediaError2['default'](err);

      // add the koment-error classname to the player
      this.addClass('koment-error');

      // log the name of the error type and any message
      // ie8 just logs "[object object]" if you just log the error object
      _utilsLog2['default'].error('(CODE:' + this.error_.code + ' ' + _mediaError2['default'].errorTypes[this.error_.code] + ')', this.error_.message, this.error_);

      // fire an error event on the player
      this.trigger('error');

      return this;
    }

    /**
     * Returns whether or not the player is in the "ended" state.
     *
     * @return {Boolean} True if the player is in the ended state, false if not.
     * @method ended
     */
  }, {
    key: 'ended',
    value: function ended() {
      return this.techGet_('ended');
    }

    /**
     * Returns whether or not the player is in the "seeking" state.
     *
     * @return {Boolean} True if the player is in the seeking state, false if not.
     * @method seeking
     */
  }, {
    key: 'seeking',
    value: function seeking() {
      return this.techGet_('seeking');
    }

    /**
     * Returns the TimeRanges of the media that are currently available
     * for seeking to.
     *
     * @return {TimeRanges} the seekable intervals of the media timeline
     * @method seekable
     */
  }, {
    key: 'seekable',
    value: function seekable() {
      return this.techGet_('seekable');
    }

    /**
     * Report user activity
     *
     * @param {Object} event Event object
     * @method reportUserActivity
     */
  }, {
    key: 'reportUserActivity',
    value: function reportUserActivity(event) {
      this.userActivity_ = true;
    }

    /**
     * Get/set if user is active
     *
     * @param {Boolean} bool Value when setting
     * @return {Boolean} Value if user is active user when getting
     * @method userActive
     */
  }, {
    key: 'userActive',
    value: function userActive(bool) {
      if (bool !== undefined) {
        bool = !!bool;
        if (bool !== this.userActive_) {
          this.userActive_ = bool;
          if (bool) {
            // If the user was inactive and is now active we want to reset the
            // inactivity timer
            this.userActivity_ = true;
            this.removeClass('koment-user-inactive');
            this.addClass('koment-user-active');
            this.trigger('useractive');
          } else {
            // We're switching the state to inactive manually, so erase any other
            // activity
            this.userActivity_ = false;

            // Chrome/Safari/IE have bugs where when you change the cursor it can
            // trigger a mousemove event. This causes an issue when you're hiding
            // the cursor when the user is inactive, and a mousemove signals user
            // activity. Making it impossible to go into inactive mode. Specifically
            // this happens in fullscreen when we really need to hide the cursor.
            //
            // When this gets resolved in ALL browsers it can be removed
            // https://code.google.com/p/chromium/issues/detail?id=103041
            if (this.tech_) {
              this.tech_.one('mousemove', function (e) {
                e.stopPropagation();
                e.preventDefault();
              });
            }

            this.removeClass('koment-user-active');
            this.addClass('koment-user-inactive');
            this.trigger('userinactive');
          }
        }
        return this;
      }
      return this.userActive_;
    }

    /**
     * Listen for user activity based on timeout value
     *
     * @private
     * @method listenForUserActivity_
     */
  }, {
    key: 'listenForUserActivity_',
    value: function listenForUserActivity_() {
      var mouseInProgress = undefined;
      var lastMoveX = undefined;
      var lastMoveY = undefined;
      var handleActivity = Fn.bind(this, this.reportUserActivity);

      var handleMouseMove = function handleMouseMove(e) {
        // #1068 - Prevent mousemove spamming
        // Chrome Bug: https://code.google.com/p/chromium/issues/detail?id=366970
        if (e.screenX !== lastMoveX || e.screenY !== lastMoveY) {
          lastMoveX = e.screenX;
          lastMoveY = e.screenY;
          handleActivity();
        }
      };

      var handleMouseDown = function handleMouseDown() {
        handleActivity();
        // For as long as the they are touching the device or have their mouse down,
        // we consider them active even if they're not moving their finger or mouse.
        // So we want to continue to update that they are active
        this.clearInterval(mouseInProgress);
        // Setting userActivity=true now and setting the interval to the same time
        // as the activityCheck interval (250) should ensure we never miss the
        // next activityCheck
        mouseInProgress = this.setInterval(handleActivity, 250);
      };

      var handleMouseUp = function handleMouseUp(event) {
        handleActivity();
        // Stop the interval that maintains activity if the mouse/touch is down
        this.clearInterval(mouseInProgress);
      };

      // Any mouse movement will be considered user activity
      this.on('mousedown', handleMouseDown);
      this.on('mousemove', handleMouseMove);
      this.on('mouseup', handleMouseUp);

      // Listen for keyboard navigation
      // Shouldn't need to use inProgress interval because of key repeat
      this.on('keydown', handleActivity);
      this.on('keyup', handleActivity);

      // Run an interval every 250 milliseconds instead of stuffing everything into
      // the mousemove/touchmove function itself, to prevent performance degradation.
      // `this.reportUserActivity` simply sets this.userActivity_ to true, which
      // then gets picked up by this loop
      // http://ejohn.org/blog/learning-from-twitter/
      var inactivityTimeout = undefined;

      this.setInterval(function () {
        // Check to see if mouse/touch activity has happened
        if (this.userActivity_) {
          // Reset the activity tracker
          this.userActivity_ = false;

          // If the user state was inactive, set the state to active
          this.userActive(true);

          // Clear any existing inactivity timeout to start the timer over
          this.clearTimeout(inactivityTimeout);

          var timeout = this.options_.inactivityTimeout;

          if (timeout > 0) {
            // In <timeout> milliseconds, if no more activity has occurred the
            // user will be considered inactive
            inactivityTimeout = this.setTimeout(function () {
              // Protect against the case where the inactivityTimeout can trigger just
              // before the next user activity is picked up by the activity check loop
              // causing a flicker
              if (!this.userActivity_) {
                this.userActive(false);
              }
            }, timeout);
          }
        }
      }, 250);
    }

    /**
     * Returns the current state of network activity for the element, from
     * the codes in the list below.
     * - NETWORK_EMPTY (numeric value 0)
     *   The element has not yet been initialised. All attributes are in
     *   their initial states.
     * - NETWORK_IDLE (numeric value 1)
     *   The element's resource selection algorithm is active and has
     *   selected a resource, but it is not actually using the network at
     *   this time.
     * - NETWORK_LOADING (numeric value 2)
     *   The user agent is actively trying to download data.
     * - NETWORK_NO_SOURCE (numeric value 3)
     *   The element's resource selection algorithm is active, but it has
     *   not yet found a resource to use.
     *
     * @see https://html.spec.whatwg.org/multipage/embedded-content.html#network-states
     * @return {Number} the current network activity state
     * @method networkState
     */
  }, {
    key: 'networkState',
    value: function networkState() {
      return this.techGet_('networkState');
    }

    /**
     * Returns a value that expresses the current state of the element
     * with respect to rendering the current playback position, from the
     * codes in the list below.
     * - HAVE_NOTHING (numeric value 0)
     *   No information regarding the media resource is available.
     * - HAVE_METADATA (numeric value 1)
     *   Enough of the resource has been obtained that the duration of the
     *   resource is available.
     * - HAVE_CURRENT_DATA (numeric value 2)
     *   Data for the immediate current playback position is available.
     * - HAVE_FUTURE_DATA (numeric value 3)
     *   Data for the immediate current playback position is available, as
     *   well as enough data for the user agent to advance the current
     *   playback position in the direction of playback.
     * - HAVE_ENOUGH_DATA (numeric value 4)
     *   The user agent estimates that enough data is available for
     *   playback to proceed uninterrupted.
     *
     * @see https://html.spec.whatwg.org/multipage/embedded-content.html#dom-media-readystate
     * @return {Number} the current playback rendering state
     * @method readyState
     */
  }, {
    key: 'readyState',
    value: function readyState() {
      return this.techGet_('readyState');
    }

    /**
     * Get video width
     *
     * @return {Number} Video width
     * @method videoWidth
     */
  }, {
    key: 'videoWidth',
    value: function videoWidth() {
      return this.tech_ && this.tech_.videoWidth && this.tech_.videoWidth() || 0;
    }

    /**
     * Get video height
     *
     * @return {Number} Video height
     * @method videoHeight
     */
  }, {
    key: 'videoHeight',
    value: function videoHeight() {
      return this.tech_ && this.tech_.videoHeight && this.tech_.videoHeight() || 0;
    }

    // Methods to add support for
    // initialTime: function() { return this.techCall_('initialTime'); },
    // startOffsetTime: function() { return this.techCall_('startOffsetTime'); },
    // played: function() { return this.techCall_('played'); },
    // defaultPlaybackRate: function() { return this.techCall_('defaultPlaybackRate'); },
    // defaultMuted: function() { return this.techCall_('defaultMuted'); }

    /**
     * The player's language code
     * NOTE: The language should be set in the player options if you want the
     * the controls to be built with a specific language. Changing the lanugage
     * later will not update controls text.
     *
     * @param {String} code  The locale string
     * @return {String}      The locale string when getting
     * @return {Player}      self when setting
     * @method language
     */
  }, {
    key: 'language',
    value: function language(code) {
      if (code === undefined) {
        return this.language_;
      }

      this.language_ = String(code).toLowerCase();
      return this;
    }

    /**
     * Get the player's language dictionary
     * Merge every time, because a newly added plugin might call koment.addLanguage() at any time
     * Languages specified directly in the player options have precedence
     *
     * @return {Array} Array of languages
     * @method languages
     */
  }, {
    key: 'languages',
    value: function languages() {
      return (0, _utilsMergeOptions2['default'])(Player.prototype.options_.languages, this.languages_);
    }

    /**
     * Creates a simple modal dialog (an instance of the `ModalDialog`
     * component) that immediately overlays the player with arbitrary
     * content and removes itself when closed.
     *
     * @param {String|Function|Element|Array|Null} content
     *        Same as `ModalDialog#content`'s param of the same name.
     *
     *        The most straight-forward usage is to provide a string or DOM
     *        element.
     *
     * @param {Object} [options]
     *        Extra options which will be passed on to the `ModalDialog`.
     *
     * @return {ModalDialog}
     */
  }, {
    key: 'createModal',
    value: function createModal(content, options) {
      var _this4 = this;

      options = options || {};
      options.content = content || '';

      var modal = new _modalDialog2['default'](this, options);

      this.addChild(modal);
      modal.on('dispose', function () {
        _this4.removeChild(modal);
      });

      return modal.open();
    }

    /**
     * Gets tag settings
     *
     * @param {Element} tag The player tag
     * @return {Array} An array of sources and track objects
     * @static
     * @method getTagSettings
     */
  }], [{
    key: 'getTagSettings',
    value: function getTagSettings(tag) {
      var baseOptions = {
        sources: [],
        tracks: []
      };
      var tagOptions = Dom.getElAttributes(tag);
      var dataSetup = tagOptions['data-setup'];

      if (!dataSetup) {
        tagOptions = Dom.getElAttributes(tag.parentNode);
        dataSetup = tagOptions['data-setup'];
      }

      // Check if data-setup attr exists.
      if (dataSetup !== null) {
        // Parse options JSON

        var _safeParseTuple = (0, _safeJsonParseTuple2['default'])(dataSetup || '{}');

        var _safeParseTuple2 = _slicedToArray(_safeParseTuple, 2);

        var err = _safeParseTuple2[0];
        var data = _safeParseTuple2[1];

        if (err) {
          _utilsLog2['default'].error(err);
        }
        (0, _objectAssign2['default'])(tagOptions, data);
      }

      (0, _objectAssign2['default'])(baseOptions, tagOptions);

      // Get tag children settings
      if (tag.hasChildNodes()) {
        var children = tag.childNodes;

        for (var i = 0, j = children.length; i < j; i++) {
          var child = children[i];
          // Change case needed: http://ejohn.org/blog/nodename-case-sensitivity/
          var childName = child.nodeName.toLowerCase();

          if (childName === 'source') {
            baseOptions.sources.push(Dom.getElAttributes(child));
          } else if (childName === 'track') {
            baseOptions.tracks.push(Dom.getElAttributes(child));
          }
        }
      }

      return baseOptions;
    }
  }]);

  return Player;
})(_component2['default']);

Player.players = {};

var navigator = _globalWindow2['default'].navigator;

/*
 * Player instance options, surfaced using options
 * options = Player.prototype.options_
 * Make changes in options, not here.
 *
 * @type {Object}
 * @private
 */
Player.prototype.options_ = {
  // default inactivity timeout
  inactivityTimeout: 2000,
  children: ['komentDisplay', 'komentList', 'progressControl', 'controlBar'],

  api: 'https://koment-api.herokuapp.com/api/koments',

  user: {},

  language: navigator && (navigator.languages && navigator.languages[0] || navigator.userLanguage || navigator.language) || 'en',

  // locales and their language translations
  languages: {},

  // Default message to show when a video cannot be played.
  notSupportedMessage: 'No compatible source was found for this media.'
};

// The following no-op expressions are here only for purposes of documentation.

Player.prototype.komentsList_ = []; // eslint-disable-line
/**
 * Fired when the user agent begins looking for media data
 *
 * @event loadstart
 */
Player.prototype.handleTechLoadStart_; // eslint-disable-line

/**
 * Fired when the player has initial duration and dimension information
 *
 * @event loadedmetadata
 */
Player.prototype.handleLoadedMetaData_; // eslint-disable-line

/**
 * Fired when the player receives text data
 *
 * @event textdata
 */
Player.prototype.handleTextData_; // eslint-disable-line

/**
 * Fired when the player has downloaded data at the current playback position
 *
 * @event loadeddata
 */
Player.prototype.handleLoadedData_; // eslint-disable-line

/**
 * Fired when the user is active, e.g. moves the mouse over the player
 *
 * @event useractive
 */
Player.prototype.handleUserActive_; // eslint-disable-line

/**
 * Fired when the user is inactive, e.g. a short delay after the last mouse move or control interaction
 *
 * @event userinactive
 */
Player.prototype.handleUserInactive_; // eslint-disable-line

/**
 * Fired when the current playback position has changed *
 * During playback this is fired every 15-250 milliseconds, depending on the
 * playback technology in use.
 *
 * @event timeupdate
 */
Player.prototype.handleTimeUpdate_; // eslint-disable-line

/**
 * Fired when video playback ends
 *
 * @event ended
 */
Player.prototype.handleTechEnded_; // eslint-disable-line

/**
 * Fired when the volume changes
 *
 * @event volumechange
 */
Player.prototype.handleVolumeChange_; // eslint-disable-line

/**
 * Fired when an error occurs
 *
 * @event error
 */
Player.prototype.handleError_; // eslint-disable-line

Player.prototype.flexNotSupported_ = function () {
  var elem = _globalDocument2['default'].createElement('i');

  // Note: We don't actually use flexBasis (or flexOrder), but it's one of the more
  // common flex features that we can rely on when checking for flex support.
  return !('flexBasis' in elem.style || 'webkitFlexBasis' in elem.style || 'mozFlexBasis' in elem.style || 'msFlexBasis' in elem.style ||
  // IE10-specific (2012 flex spec)
  'msFlexOrder' in elem.style);
};

_component2['default'].registerComponent('Player', Player);
exports['default'] = Player;
module.exports = exports['default'];
// If empty string, make it a parsable json object.