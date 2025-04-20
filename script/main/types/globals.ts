type CallableJsonProperty0<T> = T | (() => T);
type CallableJsonProperty1<S, T> = T | ((self: S) => T);
type CallableJsonProperty2<S, E, T> = T | ((entry: E, self: S) => T);
