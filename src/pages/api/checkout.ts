import { stripe } from "@/lib/stripe";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { cartParsed } = req.body    

    if(req.method !== 'POST'){
        return res.status(405).json({error: 'Method not allowed.'})
    }
    
    if(cartParsed.length == 0) {
        return res.status(400).json({error: 'Products missing in cart.'})
    }

    const success_url = `${process.env.NEXT_URL}/success?session_id={CHECKOUT_SESSION_ID}`
    const cancel_url = `${process.env.NEXT_URL}/`

    const checkoutSession = await stripe.checkout.sessions.create({
        success_url,
        cancel_url,
        mode: 'payment',
        line_items: cartParsed
    })

    return res.status(201).json({
        checkoutUrl: checkoutSession.url
    })
}