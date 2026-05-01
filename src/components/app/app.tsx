import { useEffect } from 'react';
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams
} from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo,
  ProtectedRoute
} from '@components';
import '../../index.css';
import styles from './app.module.css';
import { useDispatch } from '../../services/store';
import { checkUserAuth, fetchIngredients } from '../../services/slices';

const OrderPage = () => {
  const { number } = useParams<{ number: string }>();
  const padded = `#${(number ?? '').padStart(6, '0')}`;
  return (
    <div className={styles.detailPageWrap}>
      <p
        className={`text text_type_digits-default ${styles.detailHeader} pb-10`}
      >
        {padded}
      </p>
      <OrderInfo />
    </div>
  );
};

const OrderModalContent = ({ onClose }: { onClose: () => void }) => {
  const { number } = useParams<{ number: string }>();
  const title = `#${(number ?? '').padStart(6, '0')}`;
  return (
    <Modal title={title} onClose={onClose}>
      <OrderInfo />
    </Modal>
  );
};

const IngredientPage = () => (
  <div className={styles.detailPageWrap}>
    <h1
      className={`text text_type_main-large ${styles.detailHeader} pt-10 pb-3`}
    >
      Детали ингредиента
    </h1>
    <IngredientDetails />
  </div>
);

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background as Location | undefined;

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(checkUserAuth());
  }, [dispatch]);

  const closeModal = () => navigate(-1);

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderPage />} />
        <Route path='/ingredients/:id' element={<IngredientPage />} />

        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
          }
        />

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={<OrderModalContent onClose={closeModal} />}
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={closeModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <OrderModalContent onClose={closeModal} />
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
