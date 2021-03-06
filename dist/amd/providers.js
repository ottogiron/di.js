define(["./annotations", "./util"], function($__0,$__2) {
  "use strict";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  if (!$__2 || !$__2.__esModule)
    $__2 = {default: $__2};
  var $__1 = $__0,
      ClassProviderAnnotation = $__1.ClassProvider,
      FactoryProviderAnnotation = $__1.FactoryProvider,
      SuperConstructorAnnotation = $__1.SuperConstructor,
      readAnnotations = $__1.readAnnotations,
      hasAnnotation = $__1.hasAnnotation;
  var $__3 = $__2,
      isFunction = $__3.isFunction,
      isObject = $__3.isObject,
      toString = $__3.toString,
      isUpperCase = $__3.isUpperCase,
      ownKeys = $__3.ownKeys;
  function isClass(clsOrFunction) {
    if (hasAnnotation(clsOrFunction, ClassProviderAnnotation)) {
      return true;
    } else if (hasAnnotation(clsOrFunction, FactoryProviderAnnotation)) {
      return false;
    } else if (clsOrFunction.name) {
      return isUpperCase(clsOrFunction.name.charAt(0));
    } else {
      return ownKeys(clsOrFunction.prototype).length > 0;
    }
  }
  var EmptyFunction = Object.getPrototypeOf(Function);
  var ClassProvider = function() {
    function ClassProvider(clazz, params, isPromise) {
      this.provider = clazz;
      this.isPromise = isPromise;
      this.params = [];
      this._constructors = [];
      this._flattenParams(clazz, params);
      this._constructors.unshift([clazz, 0, this.params.length - 1]);
    }
    return ($traceurRuntime.createClass)(ClassProvider, {
      _flattenParams: function(constructor, params) {
        var SuperConstructor;
        var constructorInfo;
        var $__8 = true;
        var $__9 = false;
        var $__10 = undefined;
        try {
          for (var $__6 = void 0,
              $__5 = (params)[$traceurRuntime.toProperty(Symbol.iterator)](); !($__8 = ($__6 = $__5.next()).done); $__8 = true) {
            var param = $__6.value;
            {
              if (param.token === SuperConstructorAnnotation) {
                SuperConstructor = Object.getPrototypeOf(constructor);
                if (SuperConstructor === EmptyFunction) {
                  throw new Error((toString(constructor) + " does not have a parent constructor. Only classes with a parent can ask for SuperConstructor!"));
                }
                constructorInfo = [SuperConstructor, this.params.length];
                this._constructors.push(constructorInfo);
                this._flattenParams(SuperConstructor, readAnnotations(SuperConstructor).params);
                constructorInfo.push(this.params.length - 1);
              } else {
                this.params.push(param);
              }
            }
          }
        } catch ($__11) {
          $__9 = true;
          $__10 = $__11;
        } finally {
          try {
            if (!$__8 && $__5.return != null) {
              $__5.return();
            }
          } finally {
            if ($__9) {
              throw $__10;
            }
          }
        }
      },
      _createConstructor: function(currentConstructorIdx, context, allArguments) {
        var constructorInfo = this._constructors[currentConstructorIdx];
        var nextConstructorInfo = this._constructors[currentConstructorIdx + 1];
        var argsForCurrentConstructor;
        if (nextConstructorInfo) {
          argsForCurrentConstructor = allArguments.slice(constructorInfo[1], nextConstructorInfo[1]).concat([this._createConstructor(currentConstructorIdx + 1, context, allArguments)]).concat(allArguments.slice(nextConstructorInfo[2] + 1, constructorInfo[2] + 1));
        } else {
          argsForCurrentConstructor = allArguments.slice(constructorInfo[1], constructorInfo[2] + 1);
        }
        return function InjectedAndBoundSuperConstructor() {
          return constructorInfo[0].apply(context, argsForCurrentConstructor);
        };
      },
      create: function(args) {
        var context = Object.create(this.provider.prototype);
        var constructor = this._createConstructor(0, context, args);
        var returnedValue = constructor();
        if (isFunction(returnedValue) || isObject(returnedValue)) {
          return returnedValue;
        }
        return context;
      }
    }, {});
  }();
  var FactoryProvider = function() {
    function FactoryProvider(factoryFunction, params, isPromise) {
      this.provider = factoryFunction;
      this.params = params;
      this.isPromise = isPromise;
      var $__8 = true;
      var $__9 = false;
      var $__10 = undefined;
      try {
        for (var $__6 = void 0,
            $__5 = (params)[$traceurRuntime.toProperty(Symbol.iterator)](); !($__8 = ($__6 = $__5.next()).done); $__8 = true) {
          var param = $__6.value;
          {
            if (param.token === SuperConstructorAnnotation) {
              throw new Error((toString(factoryFunction) + " is not a class. Only classes with a parent can ask for SuperConstructor!"));
            }
          }
        }
      } catch ($__11) {
        $__9 = true;
        $__10 = $__11;
      } finally {
        try {
          if (!$__8 && $__5.return != null) {
            $__5.return();
          }
        } finally {
          if ($__9) {
            throw $__10;
          }
        }
      }
    }
    return ($traceurRuntime.createClass)(FactoryProvider, {create: function(args) {
        return this.provider.apply(undefined, args);
      }}, {});
  }();
  function createProviderFromFnOrClass(fnOrClass, annotations) {
    if (isClass(fnOrClass)) {
      return new ClassProvider(fnOrClass, annotations.params, annotations.provide.isPromise);
    }
    return new FactoryProvider(fnOrClass, annotations.params, annotations.provide.isPromise);
  }
  return {
    get createProviderFromFnOrClass() {
      return createProviderFromFnOrClass;
    },
    __esModule: true
  };
});
