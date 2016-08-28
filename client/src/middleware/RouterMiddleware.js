/**
 * Created by g.kosharov on 28.8.2016
 */
import { CALL_HISTORY_METHOD } from 'react-router-redux'

/**
 * This middleware captures CALL_HISTORY_METHOD actions to redirect to the
 * provided history object. This will prevent these actions from reaching your
 * reducer or any middleware that comes after this one.
 */
export default function routerMiddleware(getHistory) {
    return () => next => action => {
        if (action.type !== CALL_HISTORY_METHOD) {
            return next(action)
        }

        const { payload: { method, args } } = action
        console.log("Transition to ", action.payload);
        getHistory()[method](...args)
    }
}
