const Cart = require('../models/cart');
const Combo = require('../models/Combo');

// Get the current cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne()
      .populate({
        path: 'items.product',
        select: 'name mainPrice discountedPrice description picture', 
      })
      .populate({
        path: 'combos.combo',
        select: 'productIds comboDiscountPercentage',
        populate: {
          path: 'productIds',
          select: 'name mainPrice discountedPrice picture',
        },
      })
      .exec();
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
      const items = cart.items.map(item => ({
        product: item.product,
        quantity: item.quantity,
      }));
      const combos = await Promise.all(
        cart.combos.map(async (comboItem) => {
          const combo = await Combo.findById(comboItem.combo).populate({
            path: 'productIds',
            select: 'name mainPrice discountedPrice picture',
          });
          const comboProductsDetails = combo.productIds.map((product, index) => ({
            product,
            quantity: comboItem.quantities[0],
          }));
          const totalComboPrice = comboProductsDetails.reduce((total, item) => {
            const discountedPrice = item.product.discountedPrice || item.product.mainPrice;
            return total + discountedPrice * item.quantity;
          }, 0);
          const discountPercentage = combo.comboDiscountPercentage;
          const discountAmount = (totalComboPrice * discountPercentage) / 100;
          const totalPriceAfterDiscount = totalComboPrice - discountAmount;
          return {
            combo,
            comboProductsDetails,
            totalComboPrice,
            discountAmount,
            totalPriceAfterDiscount
          };
        })
      );
      res.json({
        items,
        combos,
      });
  
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add item to cart
exports.addItemToCart = async (req, res) => {

  const { productId,quantity } = req.body;
  try {
    let cart = await Cart.findOne();
    if (!cart) {
      cart = new Cart({ items: [] });
    }
    const existingItem = cart.items.find(item => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId });
    }
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Remove item from cart
exports.removeItemFromCart = async (req, res) => {
  const { productId } = req.body;
  try {
    const cart = await Cart.findOne();
    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.removeComboFromCart = async (req, res) => {
  const { comboId } = req.body;
  console.log('comboId',comboId)
  try {

    const cart = await Cart.findOne();
    console.log('cart',cart)
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    const comboItem = cart.combos.find(item => item.combo.equals(comboId));
    if (!comboItem) {
      return res.status(404).json({ message: 'Combo not found in the cart' });
    }
    cart.combos = cart.combos.filter(item => !item.combo.equals(comboId));
 
    await cart.save();
    res.json(cart);
  }catch(error){
      res.status(400).json({ message: error.message });
  }

}
exports.addComboItems =async(req,res)=>{
  const { comboId, quantities } = req.body;
  try {
    const combo = await Combo.findById(comboId).populate('productIds');
    if (!combo) {
      return res.status(404).json({ message: 'Combo not found' });
    }

    const cart = await Cart.findOne() || new Cart();
    const existingComboItem = cart.combos.find(item => item.combo.equals(comboId));
    if (existingComboItem) {
      existingComboItem.quantities= [Number(existingComboItem.quantities)+Number(quantities)];
    } else {
      cart.combos.push({ combo: comboId, quantities });
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Calculate cart total with combo discount
exports.calculateCartTotal = async (req, res) => {
  try {
    const cart = await Cart.findOne()
      .populate({
        path: 'items.product',
        select: 'name mainPrice discountedPrice',
      })
      .populate({
        path: 'combos.combo',
        populate: {
          path: 'productIds',
          select: 'name mainPrice discountedPrice'
        },
      })
      .exec();

    const combos = cart.combos

    let total = 0;
    let totalDiscount = 0;
    let comboApplied = false;
    cart.items.forEach(item => {
      total += Number(((item.product.discountedPrice || item.product.mainPrice) * item.quantity).toFixed(2));
    });
    for (const comboItem of combos) {
      const combo = comboItem.combo;
      const comboTotalPrice = combo.productIds.reduce((sum, product) => {
        return sum + (product.discountedPrice || product.mainPrice) * comboItem.quantities[0];
      }, 0);
    
      // Calculate the discount for the combo
      const discountPercentage = combo.comboDiscountPercentage;
      const discountAmount = ((comboTotalPrice * discountPercentage) / 100);
      total += Number(comboTotalPrice);
    
      totalDiscount += discountAmount;
      comboApplied = true;
    }
    const finalTotal = (total - totalDiscount).toFixed(2);
    totalDiscount = totalDiscount.toFixed(2);
    res.json({ total: finalTotal, totalDiscount, comboApplied });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
