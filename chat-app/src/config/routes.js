import {
  HOME_PAGE,
  SIGN_IN_PAGE,
  SIGN_UP_PAGE,
  VIDEOS,
  SETTINGS,
  USERPROFILE,
  ARCHIVE,
  VERIFY_EMAIL,
  NOT_FOUND,
  USERINFO,
  RESET_PASSWORD,
} from '../constants/routes';
import Home from '../pages/Home/Home';
import SignIn from '../pages/SignIn/SignIn';
import SignUp from '../pages/SignUp/SignUp';
import ForgetPassword from '../pages/ForgetPassword/ResetPassword';
import Videos from '../pages/Videos/Videos';
import Settings from '../pages/Settings/Settings';
import UserProfile from '../pages/UserProfile/UserProfile';
import UserInfo from '../pages/UserInfo/UserInfo';
import NotFound from '../pages/not-found';
import Feed from '../pages/NewsFeed/Feed';
import Archive from '../pages/Archive/Archive';
import VerifyEmail from '../pages/VerifyEmail/VerifyEmail';

import AuthGuard from '../Guard/AuthGuard';
import GustGuard from '../Guard/GustGuard';


const routes = [
  {
    path: HOME_PAGE,
    Component: Home,
    Guard: AuthGuard,
  },
  {
    path: SIGN_IN_PAGE,
    Component: SignIn,
    Guard: GustGuard,
  },
  {
    path: SIGN_UP_PAGE,
    Component: SignUp,
    Guard: GustGuard,
  },
   {
    path: RESET_PASSWORD,
    Component: ForgetPassword,
   },
  {
    path: VIDEOS,
    Component: Videos,
    Guard: AuthGuard,
  },
  {
    path: SETTINGS,
    Component: Settings,
    Guard: AuthGuard,
  },
  {
    path: USERPROFILE,
    Component: UserProfile,
    Guard: AuthGuard,
  },
  {
    path: USERINFO,
    Component: UserInfo,
    Guard: AuthGuard,
  },
  {
    path: ARCHIVE,
    Component: Archive,
    Guard: AuthGuard,
  },
  {
    path: VERIFY_EMAIL,
    Component: VerifyEmail,
    Guard: AuthGuard
  },
  {
    path: '/feed',
    Component: Feed,
    Guard: AuthGuard,
  },
  {
    path: NOT_FOUND,
    Component: NotFound,
  },
];

export default routes;
