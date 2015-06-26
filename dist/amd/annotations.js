define(["./util"], function($__0) {
  "use strict";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  var isFunction = $__0.isFunction;
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
          $__17 = 0; $__17 < arguments.length; $__17++)
        tokens[$__17] = arguments[$__17];
      this.tokens = tokens;
      this.isPromise = false;
      this.isLazy = false;
    }
    return ($traceurRuntime.createClass)(Inject, {}, {});
  }();
  var InjectPromise = function($__super) {
    function InjectPromise() {
      for (var tokens = [],
          $__17 = 0; $__17 < arguments.length; $__17++)
        tokens[$__17] = arguments[$__17];
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
          $__17 = 0; $__17 < arguments.length; $__17++)
        tokens[$__17] = arguments[$__17];
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
    var $__6 = true;
    var $__7 = false;
    var $__8 = undefined;
    try {
      for (var $__4 = void 0,
          $__3 = (fn.annotations)[$traceurRuntime.toProperty(Symbol.iterator)](); !($__6 = ($__4 = $__3.next()).done); $__6 = true) {
        var annotation = $__4.value;
        {
          if (annotation instanceof annotationClass) {
            return true;
          }
        }
      }
    } catch ($__9) {
      $__7 = true;
      $__8 = $__9;
    } finally {
      try {
        if (!$__6 && $__3.return != null) {
          $__3.return();
        }
      } finally {
        if ($__7) {
          throw $__8;
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
      var $__6 = true;
      var $__7 = false;
      var $__8 = undefined;
      try {
        for (var $__4 = void 0,
            $__3 = (fn.annotations)[$traceurRuntime.toProperty(Symbol.iterator)](); !($__6 = ($__4 = $__3.next()).done); $__6 = true) {
          var annotation = $__4.value;
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
      } catch ($__9) {
        $__7 = true;
        $__8 = $__9;
      } finally {
        try {
          if (!$__6 && $__3.return != null) {
            $__3.return();
          }
        } finally {
          if ($__7) {
            throw $__8;
          }
        }
      }
    }
    if (fn.parameters) {
      fn.parameters.forEach(function(param, idx) {
        var $__13 = true;
        var $__14 = false;
        var $__15 = undefined;
        try {
          for (var $__11 = void 0,
              $__10 = (param)[$traceurRuntime.toProperty(Symbol.iterator)](); !($__13 = ($__11 = $__10.next()).done); $__13 = true) {
            var paramAnnotation = $__11.value;
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
        } catch ($__16) {
          $__14 = true;
          $__15 = $__16;
        } finally {
          try {
            if (!$__13 && $__10.return != null) {
              $__10.return();
            }
          } finally {
            if ($__14) {
              throw $__15;
            }
          }
        }
      });
    }
    return collectedAnnotations;
  }
  return {
    get annotate() {
      return annotate;
    },
    get hasAnnotation() {
      return hasAnnotation;
    },
    get readAnnotations() {
      return readAnnotations;
    },
    get SuperConstructor() {
      return SuperConstructor;
    },
    get TransientScope() {
      return TransientScope;
    },
    get Inject() {
      return Inject;
    },
    get InjectPromise() {
      return InjectPromise;
    },
    get InjectLazy() {
      return InjectLazy;
    },
    get Provide() {
      return Provide;
    },
    get ProvidePromise() {
      return ProvidePromise;
    },
    get ClassProvider() {
      return ClassProvider;
    },
    get FactoryProvider() {
      return FactoryProvider;
    },
    __esModule: true
  };
});
