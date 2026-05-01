import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUserOrders } from '../../services/slices';
import { selectUserOrders } from '../../services/selectors';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);

  useEffect(() => {
    dispatch(fetchUserOrders());
    const id = setInterval(() => dispatch(fetchUserOrders()), 15000);
    return () => clearInterval(id);
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
