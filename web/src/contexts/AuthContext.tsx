import { Auth, getAuth, User } from '@firebase/auth';
import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { useHistory, useLocation } from 'react-router';

export type StateType = Dispatch<SetStateAction<Partial<AuthContextType>>>;
interface AuthContextType {
  user?: User;
  auth: Auth;
}

const defaultState: AuthContextType = {} as AuthContextType;
const authContext = createContext<[AuthContextType, StateType]>([
  defaultState,
  (): void => console.info('Default function')
]);

export const useAuthContext = (): [AuthContextType, StateType] => useContext(authContext);

export const AuthProvider: FC = ({ children }) => {
  const [state, setState] = useState<AuthContextType>({ auth: getAuth() });
  const auth = useRef(getAuth());
  const history = useHistory();
  const location = useLocation();
  const stateValue: [AuthContextType, StateType] = useMemo(
    () => [state, (state) => setState((s) => ({ ...s, state }))],
    [state]
  );

  useEffect(() => {
    const unSub = auth.current.onAuthStateChanged((user) => {
      console.log('onAuthStateChanged');
      if (user) {
        setState((s) => ({ ...s, user }));
        if (location.pathname.toLowerCase() === '/login') {
          history.push('/');
        }
      } else if (location.pathname !== '/login') {
        history.push('/login');
      }
    });

    return () => unSub();
  }, [location.pathname, history]);

  return <authContext.Provider value={stateValue}>{children}</authContext.Provider>;
};
