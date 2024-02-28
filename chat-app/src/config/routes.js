import {
  HOME_PAGE,
  SIGN_IN_PAGE,
  SIGN_UP_PAGE,
  NOT_FOUND,
} from '../constants/routes';
import Home from '../pages/Home/Home';
import SignIn from '../pages/SignIn/SignIn';
import SignUp from '../pages/SignUp/SignUp';
import NotFound from '../pages/not-found';

const routes = [
  {
    path: HOME_PAGE,
    Component: Home,
  },
  {
    path: SIGN_IN_PAGE,
    Component: SignIn,
  },
  {
    path: SIGN_UP_PAGE,
    Component: SignUp,
  },
  {
    path: NOT_FOUND,
    Component: NotFound,
  },
];

export default routes;
