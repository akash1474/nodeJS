/* eslink-disable */

const stripe = Stripe('pasteThePublicKeyHere');
import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  try {
    //1]Get the checkout session from the API
    const session = await axios(`/bookings/checkkout-session/${tourId}`);
    //2]Create checkout form + charge the credit Card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
