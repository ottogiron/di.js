"use strict";
var $__util__;
var isFunction = ($__util__ = require("./util"), $__util__ && $__util__.__esModule && $__util__ || {default: $__util__}).isFunction;
var SuperConstructor = function() {
  function SuperConstructor() {}
  return ($traceurRuntime.createClass)(SuperConstructor, {}, {});
}();
var TransientScope = function() {
  function TransientScope() {}
  return ($traceurRuntime.createClass)(TransientScope, {}, {});
}();
var Inject = function() {
  function Inject() {
    for (var tokens = [],
        $__16 = 0; $__16 < arguments.length; $__16++)
      tokens[$__16] = arguments[$__16];
    this.tokens = tokens;
    this.isPromise = false;
    this.isLazy = false;
  }
  return ($traceurRuntime.createClass)(Inject, {}, {});
}();
var InjectPromise = function($__super) {
  function InjectPromise() {
    for (var tokens = [],
        $__16 = 0; $__16 < arguments.length; $__16++)
      tokens[$__16] = arguments[$__16];
    $traceurRuntime.superConstructor(InjectPromise).call(this);
    this.tokens = tokens;
    this.isPromise = true;
    this.isLazy = false;
  }
  return ($traceurRuntime.createClass)(InjectPromise, {}, {}, $__super);
}(Inject);
var InjectLazy = function($__super) {
  function InjectLazy() {
    for (var tokens = [],
        $__16 = 0; $__16 < arguments.length; $__16++)
      tokens[$__16] = arguments[$__16];
    $traceurRuntime.superConstructor(InjectLazy).call(this);
    this.tokens = tokens;
    this.isPromise = false;
    this.isLazy = true;
  }
  return ($traceurRuntime.createClass)(InjectLazy, {}, {}, $__super);
}(Inject);
var Provide = function() {
  function Provide(token) {
    this.token = token;
    this.isPromise = false;
  }
  return ($traceurRuntime.createClass)(Provide, {}, {});
}();
var ProvidePromise = function($__super) {
  function ProvidePromise(token) {
    $traceurRuntime.superConstructor(ProvidePromise).call(this);
    this.token = token;
    this.isPromise = true;
  }
  return ($traceurRuntime.createClass)(ProvidePromise, {}, {}, $__super);
}(Provide);
var ClassProvider = function() {
  function ClassProvider() {}
  return ($traceurRuntime.createClass)(ClassProvider, {}, {});
}();
var FactoryProvider = function() {
  function FactoryProvider() {}
  return ($traceurRuntime.createClass)(FactoryProvider, {}, {});
}();
function annotate(fn, annotation) {
  fn.annotations = fn.annotations || [];
  fn.annotations.push(annotation);
}
function hasAnnotation(fn, annotationClass) {
  if (!fn.annotations || fn.annotations.length === 0) {
    return false;
  }
  var $__5 = true;
  var $__6 = false;
  var $__7 = undefined;
  try {
    for (var $__3 = void 0,
        $__2 = (fn.annotations)[$traceurRuntime.toProperty(Symbol.iterator)](); !($__5 = ($__3 = $__2.next()).done); $__5 = true) {
      var annotation = $__3.value;
      {
        if (annotation instanceof annotationClass) {
          return true;
        }
      }
    }
  } catch ($__8) {
    $__6 = true;
    $__7 = $__8;
  } finally {
    try {
      if (!$__5 && $__2.return != null) {
        $__2.return();
      }
    } finally {
      if ($__6) {
        throw $__7;
      }
    }
  }
  return false;
}
function readAnnotations(fn) {
  var collectedAnnotations = {
    provide: {
      token: null,
      isPromise: false
    },
    params: []
  };
  if (fn.annotations && fn.annotations.length) {
    var $__5 = true;
    var $__6 = false;
    var $__7 = undefined;
    try {
      for (var $__3 = void 0,
          $__2 = (fn.annotations)[$traceurRuntime.toProperty(Symbol.iterator)](); !($__5 = ($__3 = $__2.next()).done); $__5 = true) {
        var annotation = $__3.value;
        {
          if (annotation instanceof Inject) {
            annotation.tokens.forEach(function(token) {
              collectedAnnotations.params.push({
                token: token,
                isPromise: annotation.isPromise,
                isLazy: annotation.isLazy
              });
            });
          }
          if (annotation instanceof Provide) {
            collectedAnnotations.provide.token = annotation.token;
            collectedAnnotations.provide.isPromise = annotation.isPromise;
          }
        }
      }
    } catch ($__8) {
      $__6 = true;
      $__7 = $__8;
    } finally {
      try {
        if (!$__5 && $__2.return != null) {
          $__2.return();
        }
      } finally {
        if ($__6) {
          throw $__7;
        }
      }
    }
  }
  if (fn.parameters) {
    fn.parameters.forEach(function(param, idx) {
      var $__12 = true;
      var $__13 = false;
      var $__14 = undefined;
      try {
        for (var $__10 = void 0,
            $__9 = (param)[$traceurRuntime.toProperty(Symbol.iterator)](); !($__12 = ($__10 = $__9.next()).done); $__12 = true) {
          var paramAnnotation = $__10.value;
          {
            if (isFunction(paramAnnotation) && !collectedAnnotations.params[idx]) {
              collectedAnnotations.params[idx] = {
                token: paramAnnotation,
                isPromise: false,
                isLazy: false
              };
            } else if (paramAnnotation instanceof Inject) {
              collectedAnnotations.params[idx] = {
                token: paramAnnotation.tokens[0],
                isPromise: paramAnnotation.isPromise,
                isLazy: paramAnnotation.isLazy
              };
            }
          }
        }
      } catch ($__15) {
        $__13 = true;
        $__14 = $__15;
      } finally {
        try {
          if (!$__12 && $__9.return != null) {
            $__9.return();
          }
        } finally {
          if ($__13) {
            throw $__14;
          }
        }
      }
    });
  }
  return collectedAnnotations;
}
Object.defineProperties(module.exports, {
  annotate: {get: function() {
      return annotate;
    }},
  hasAnnotation: {get: function() {
      return hasAnnotation;
    }},
  readAnnotations: {get: function() {
      return readAnnotations;
    }},
  SuperConstructor: {get: function() {
      return SuperConstructor;
    }},
  TransientScope: {get: function() {
      return TransientScope;
    }},
  Inject: {get: function() {
      return Inject;
    }},
  InjectPromise: {get: function() {
      return InjectPromise;
    }},
  InjectLazy: {get: function() {
      return InjectLazy;
    }},
  Provide: {get: function() {
      return Provide;
    }},
  ProvidePromise: {get: function() {
      return ProvidePromise;
    }},
  ClassProvider: {get: function() {
      return ClassProvider;
    }},
  FactoryProvider: {get: function() {
      return FactoryProvider;
    }},
  __esModule: {value: true}
});
