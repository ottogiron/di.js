define(["./annotations", "./util", "./profiler", "./providers"], function($__0,$__2,$__4,$__6) {
  "use strict";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  if (!$__2 || !$__2.__esModule)
    $__2 = {default: $__2};
  if (!$__4 || !$__4.__esModule)
    $__4 = {default: $__4};
  if (!$__6 || !$__6.__esModule)
    $__6 = {default: $__6};
  var $__1 = $__0,
      annotate = $__1.annotate,
      readAnnotations = $__1.readAnnotations,
      hasAnnotation = $__1.hasAnnotation,
      ProvideAnnotation = $__1.Provide,
      TransientScopeAnnotation = $__1.TransientScope;
  var $__3 = $__2,
      isFunction = $__3.isFunction,
      toString = $__3.toString;
  var profileInjector = $__4.profileInjector;
  var createProviderFromFnOrClass = $__6.createProviderFromFnOrClass;
  function constructResolvingMessage(resolving, token) {
    if (arguments.length > 1) {
      resolving.push(token);
    }
    if (resolving.length > 1) {
      return (" (" + resolving.map(toString).join(' -> ') + ")");
    }
    return '';
  }
  var Injector = function() {
    function Injector() {
      var modules = arguments[0] !== (void 0) ? arguments[0] : [];
      var parentInjector = arguments[1] !== (void 0) ? arguments[1] : null;
      var providers = arguments[2] !== (void 0) ? arguments[2] : new Map();
      var scopes = arguments[3] !== (void 0) ? arguments[3] : [];
      this._cache = new Map();
      this._providers = providers;
      this._parent = parentInjector;
      this._scopes = scopes;
      this._loadModules(modules);
      profileInjector(this, Injector);
    }
    return ($traceurRuntime.createClass)(Injector, {
      _collectProvidersWithAnnotation: function(annotationClass, collectedProviders) {
        this._providers.forEach(function(provider, token) {
          if (!collectedProviders.has(token) && hasAnnotation(provider.provider, annotationClass)) {
            collectedProviders.set(token, provider);
          }
        });
        if (this._parent) {
          this._parent._collectProvidersWithAnnotation(annotationClass, collectedProviders);
        }
      },
      _loadModules: function(modules) {
        var $__13 = true;
        var $__14 = false;
        var $__15 = undefined;
        try {
          for (var $__11 = void 0,
              $__10 = (modules)[$traceurRuntime.toProperty(Symbol.iterator)](); !($__13 = ($__11 = $__10.next()).done); $__13 = true) {
            var module = $__11.value;
            {
              if (isFunction(module)) {
                this._loadFnOrClass(module);
                continue;
              }
              throw new Error('Invalid module!');
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
      },
      _loadFnOrClass: function(fnOrClass) {
        var annotations = readAnnotations(fnOrClass);
        var token = annotations.provide.token || fnOrClass;
        var provider = createProviderFromFnOrClass(fnOrClass, annotations);
        this._providers.set(token, provider);
      },
      _hasProviderFor: function(token) {
        if (this._providers.has(token)) {
          return true;
        }
        if (this._parent) {
          return this._parent._hasProviderFor(token);
        }
        return false;
      },
      _instantiateDefaultProvider: function(provider, token, resolving, wantPromise, wantLazy) {
        if (!this._parent) {
          this._providers.set(token, provider);
          return this.get(token, resolving, wantPromise, wantLazy);
        }
        var $__13 = true;
        var $__14 = false;
        var $__15 = undefined;
        try {
          for (var $__11 = void 0,
              $__10 = (this._scopes)[$traceurRuntime.toProperty(Symbol.iterator)](); !($__13 = ($__11 = $__10.next()).done); $__13 = true) {
            var ScopeClass = $__11.value;
            {
              if (hasAnnotation(provider.provider, ScopeClass)) {
                this._providers.set(token, provider);
                return this.get(token, resolving, wantPromise, wantLazy);
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
        return this._parent._instantiateDefaultProvider(provider, token, resolving, wantPromise, wantLazy);
      },
      get: function(token) {
        var resolving = arguments[1] !== (void 0) ? arguments[1] : [];
        var wantPromise = arguments[2] !== (void 0) ? arguments[2] : false;
        var wantLazy = arguments[3] !== (void 0) ? arguments[3] : false;
        var $__8 = this;
        var resolvingMsg = '';
        var provider;
        var instance;
        var injector = this;
        if (token === null || token === undefined) {
          resolvingMsg = constructResolvingMessage(resolving, token);
          throw new Error(("Invalid token \"" + token + "\" requested!" + resolvingMsg));
        }
        if (token === Injector) {
          if (wantPromise) {
            return Promise.resolve(this);
          }
          return this;
        }
        if (wantLazy) {
          return function createLazyInstance() {
            var lazyInjector = injector;
            if (arguments.length) {
              var locals = [];
              var args = arguments;
              for (var i = 0; i < args.length; i += 2) {
                locals.push((function(ii) {
                  var fn = function createLocalInstance() {
                    return args[ii + 1];
                  };
                  annotate(fn, new ProvideAnnotation(args[ii]));
                  return fn;
                })(i));
              }
              lazyInjector = injector.createChild(locals);
            }
            return lazyInjector.get(token, resolving, wantPromise, false);
          };
        }
        if (this._cache.has(token)) {
          instance = this._cache.get(token);
          provider = this._providers.get(token);
          if (provider.isPromise && !wantPromise) {
            resolvingMsg = constructResolvingMessage(resolving, token);
            throw new Error(("Cannot instantiate " + toString(token) + " synchronously. It is provided as a promise!" + resolvingMsg));
          }
          if (!provider.isPromise && wantPromise) {
            return Promise.resolve(instance);
          }
          return instance;
        }
        provider = this._providers.get(token);
        if (!provider && isFunction(token) && !this._hasProviderFor(token)) {
          provider = createProviderFromFnOrClass(token, readAnnotations(token));
          return this._instantiateDefaultProvider(provider, token, resolving, wantPromise, wantLazy);
        }
        if (!provider) {
          if (!this._parent) {
            resolvingMsg = constructResolvingMessage(resolving, token);
            throw new Error(("No provider for " + toString(token) + "!" + resolvingMsg));
          }
          return this._parent.get(token, resolving, wantPromise, wantLazy);
        }
        if (resolving.indexOf(token) !== -1) {
          resolvingMsg = constructResolvingMessage(resolving, token);
          throw new Error(("Cannot instantiate cyclic dependency!" + resolvingMsg));
        }
        resolving.push(token);
        var delayingInstantiation = wantPromise && provider.params.some(function(param) {
          return !param.isPromise;
        });
        var args = provider.params.map(function(param) {
          if (delayingInstantiation) {
            return $__8.get(param.token, resolving, true, param.isLazy);
          }
          return $__8.get(param.token, resolving, param.isPromise, param.isLazy);
        });
        if (delayingInstantiation) {
          var delayedResolving = resolving.slice();
          resolving.pop();
          return Promise.all(args).then(function(args) {
            try {
              instance = provider.create(args);
            } catch (e) {
              resolvingMsg = constructResolvingMessage(delayedResolving);
              var originalMsg = 'ORIGINAL ERROR: ' + e.message;
              e.message = ("Error during instantiation of " + toString(token) + "!" + resolvingMsg + "\n" + originalMsg);
              throw e;
            }
            if (!hasAnnotation(provider.provider, TransientScopeAnnotation)) {
              injector._cache.set(token, instance);
            }
            return instance;
          });
        }
        try {
          instance = provider.create(args);
        } catch (e) {
          resolvingMsg = constructResolvingMessage(resolving);
          var originalMsg = 'ORIGINAL ERROR: ' + e.message;
          e.message = ("Error during instantiation of " + toString(token) + "!" + resolvingMsg + "\n" + originalMsg);
          throw e;
        }
        if (!hasAnnotation(provider.provider, TransientScopeAnnotation)) {
          this._cache.set(token, instance);
        }
        if (!wantPromise && provider.isPromise) {
          resolvingMsg = constructResolvingMessage(resolving);
          throw new Error(("Cannot instantiate " + toString(token) + " synchronously. It is provided as a promise!" + resolvingMsg));
        }
        if (wantPromise && !provider.isPromise) {
          instance = Promise.resolve(instance);
        }
        resolving.pop();
        return instance;
      },
      getPromise: function(token) {
        return this.get(token, [], true);
      },
      createChild: function() {
        var modules = arguments[0] !== (void 0) ? arguments[0] : [];
        var forceNewInstancesOf = arguments[1] !== (void 0) ? arguments[1] : [];
        var forcedProviders = new Map();
        forceNewInstancesOf.push(TransientScopeAnnotation);
        var $__13 = true;
        var $__14 = false;
        var $__15 = undefined;
        try {
          for (var $__11 = void 0,
              $__10 = (forceNewInstancesOf)[$traceurRuntime.toProperty(Symbol.iterator)](); !($__13 = ($__11 = $__10.next()).done); $__13 = true) {
            var annotation = $__11.value;
            {
              this._collectProvidersWithAnnotation(annotation, forcedProviders);
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
        return new Injector(modules, this, forcedProviders, forceNewInstancesOf);
      }
    }, {});
  }();
  return {
    get Injector() {
      return Injector;
    },
    __esModule: true
  };
});
