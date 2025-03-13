require("dotenv").config();
const Chapa = require("chapa");

const chapa = new Chapa(process.env.CHAPA_SECRET_KEY);  

exports.initializePayment = async (req, res) => {
    try {
      const { amount, currency, email, first_name, last_name } = req.body;
  
      if (!amount || !currency || !email || !first_name || !last_name) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      const customerInfo = {
        amount,
        currency,
        email,
        first_name,
        last_name,
        callback_url: "https://talakkinash/verified.com/", 
        customization: {
          title: "Deal & Promotion Payment",
          description: "Secure Payment via Chapa",
        },
      };
  
      const response = await chapa.initialize(customerInfo, { autoRef: true });
  
      if (response.status === "success") {
        return res.status(200).json({
          message: "success",
          checkout_url: response.data.checkout_url,
          tx_ref: response.tx_ref,
        });
      } else {
        res.status(404).json({ message: "All fields are required" }); 
      }
    } catch (error) {
        console.log("CHAPA SECRET KEY:", process.env.CHAPA_SECRET_KEY); 
      res.status(500).json({ message: error.message });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
      const { tx_ref } = req.params; 
  
      if (!tx_ref) {
        return res.status(400).json({ message: "Transaction reference is required" });
      }
  
      const response = await chapa.verify(tx_ref);
  
      if(response.status === "success") {
        return res.status(200).json({
            message: "Payment verified successfully", 
            data: response 
        });

      } else {
        return res.status(400).json({ message: "Payment verification failed", data: response });
      }

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};
