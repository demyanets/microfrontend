/**
 * Defines how the meta router determines
 * wheter the metaroute (microfronend) has a state (= dirty)
 */
export enum MetaRouteStateEvaluation {
    /**
     * Evaluates the state for the route. The metaroute
     * will be reported dirty only if the active route has as state.
     * The subRoute supplied to @see RoutedApp.changeState must
     * always be the active route of the metaroute.
     * This is the default evaluation.
     */
    RouteBased = 'RouteBased',
    /**
     * Evaluates the state for the entire metaroute. The metaroute
     * will be reported dirty if any subroute has as state.
     * The subRoute supplied to @see RoutedApp.changeState may
     * be any string.
     */
    AppBased = 'AppBased'
}
