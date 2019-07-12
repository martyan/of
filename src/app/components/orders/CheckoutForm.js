import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
    CardNumberElement,
    CardExpiryElement,
    CardCVCElement,
    injectStripe
} from 'react-stripe-elements'
import TextInput from '../common/TextInput'

const CheckoutForm = ({ createPayment, stripe }) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')

    const options = {
        style: {
            base: {
                color: '#424770',
                letterSpacing: '0.025em',
                fontFamily: 'Source Code Pro, monospace',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                color: '#9e2146',
            }
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        stripe.createPaymentMethod('card', {billing_details: {name: 'Jenny Rosen'}})
            .then(({ paymentMethod }) => {
                if(!paymentMethod) return

                createPayment({payment_method_id: paymentMethod.id})
                    .then(handleServerResponse)
            })
            .catch(console.error)
    }

    const handleServerResponse = async (response) => {
        if (response.error) {
            // Show error from server on payment form
        } else if (response.requires_action) {
            // Use Stripe.js to handle the required card action
            const { error: errorAction, paymentIntent } =
                await stripe.handleCardAction(response.payment_intent_client_secret)

            if (errorAction) {
                // Show error from Stripe.js in payment form
            } else {
                // The card action has been handled
                // The PaymentIntent can be confirmed again on the server

                const serverResponse = await createPayment({payment_intent_id: paymentIntent.id})
                handleServerResponse(serverResponse)
            }
        } else {
            // Show success message
        }
    }


    return (
        <form onSubmit={handleSubmit}>
            <TextInput
                placeholder="Full name"
                value={name}
                onChange={setName}
            />

            <TextInput
                placeholder="Email"
                value={email}
                onChange={setEmail}
            />

            <TextInput
                placeholder="Phone"
                value={phone}
                onChange={setPhone}
            />

            4000002760003184<br/>
            <label>
                Card number
                <CardNumberElement
                    onBlur={console.log}
                    onChange={console.log}
                    onFocus={console.log}
                    onReady={console.log}
                    {...options}
                />
            </label>
            <label>
                Expiration date
                <CardExpiryElement
                    onBlur={console.log}
                    onChange={console.log}
                    onFocus={console.log}
                    onReady={console.log}
                    {...options}
                />
            </label>
            <label>
                CVC
                <CardCVCElement
                    onBlur={console.log}
                    onChange={console.log}
                    onFocus={console.log}
                    onReady={console.log}
                    {...options}
                />
            </label>
            <button>Pay</button>
        </form>
    )

}

CheckoutForm.propTypes = {
    createPayment: PropTypes.func.isRequired
}

export default injectStripe(CheckoutForm)
