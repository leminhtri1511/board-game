const logger = require('../utils/logger');

// User
exports.qFindAllUser = (page, pageSize) => {
  if (page && pageSize) {
    return `EXECUTE proc_User_Getall ${page}, ${pageSize}`;
  } else
    return `SELECT Id, FullName, Email, DOB, Gender, Phone, Avatar, CreatedAt
    ,CreatedBy, UpdatedAt, UpdatedBy, Role, IsLock FROM [User]`;
};
exports.qFindUser = (username, email) => {
  if (email)
    return `SELECT * FROM [User] WHERE Username='${username}' OR Email='${email}'`;
  else return `SELECT * FROM [User] WHERE Username='${username}'`;
};
exports.qFindUserById = (id) => {
  return `SELECT * FROM [User] WHERE Id='${id}'`;
};
exports.qFindUserByUsername = (username) => {
  return `SELECT * FROM [User] WHERE Username='${username}'`;
};
exports.qLockUser = (id) => {
  return `EXECUTE proc_User_Lock ${id}`;
};
exports.qUpdateUser = (id, fullName, phone, dob, gender, email, avatar) => {
  const q = `EXECUTE proc_User_Update ${id}, ${
    fullName ? "N'" + fullName + "'" : 'NULL'
  }, ${phone ? "'" + phone + "'" : 'NULL'}, ${
    dob ? "'" + dob + "'" : 'NULL'
  }, ${gender || 'NULL'}, ${email ? "'" + email + "'" : 'NULL'}, ${
    avatar ? "'" + avatar + "'" : 'NULL'
  }`;
  return q;
};

exports.qChangePass = (id, newPass) => {
  return `EXECUTE proc_User_ChangePass ${id}, '${newPass}'`;
};

// Address
exports.qGetListAddrByUserId = (userId) => {
  return `SELECT * FROM UserAddress WHERE UserId = ${userId}`;
};
exports.qGetAddressById = (id) => {
  return `SELECT * FROM UserAddress WHERE Id = ${id}`;
};
exports.qAddAddress = (userId, fullName, phone, address, isDefault) => {
  const q = `INSERT INTO UserAddress (UserId, Fullname, Phone, Address, IsDefault)
  OUTPUT Inserted.ID
  VALUES (${userId}, N'${fullName}', '${phone}', N'${address}', ${isDefault})`;
  return q;
};
exports.qSetAddressDefaultToFalseExceptId = (userId, addressId) => {
  return `UPDATE UserAddress 
  SET	IsDefault = 0
  WHERE Id <> ${addressId} AND UserId = ${userId} AND IsDefault = 1
  `;
};
exports.qUpdateAddress = (id, fullName, phone, address, isDefault) => {
  const q = `EXECUTE proc_Address_Update ${id}, ${
    fullName ? "N'" + fullName + "'" : 'NULL'
  }, ${phone ? "'" + phone + "'" : 'NULL'}, ${
    address ? "N'" + address + "'" : 'NULL'
  }, ${isDefault || 'NULL'}`;
  return q;
};
exports.qDeleteAddress = (id) => {
  return `DELETE FROM UserAddress WHERE Id = ${id}`;
};
// Cart
// exports.qGetCartByUserId = (userId) => {
//   return `EXECUTE proc_Cart_Get ${userId}`;
// };

exports.qGetCartByUserId = (userId) => {
  return `SELECT cp.Id , p.Id AS 'ProductId' , p.Name, cp.Amount ,pp.Id AS PriceId, pp.Price, p.MainImage , isnull(slcl.SoConLai, p.Amount) AS 'RemainingAmount' 
	FROM 	Cart AS c 
	    JOIN CartProduct AS cp ON c.Id = cp.CartId 
			LEFT JOIN Product AS p ON cp.ProductId  = p.Id 
			LEFT JOIN ProductPrice pp ON pp.ProductId = p.Id 
			LEFT JOIN (
				SELECT Product.Id , (Product.Amount - SUM(OrderDetail.Quantity)) AS SoConLai
				FROM Product 
				JOIN OrderDetail ON Product .Id = OrderDetail.ProductId 
				GROUP BY Product.Id , Product.Amount 
			) AS slcl ON slcl.Id = p.Id  
	WHERE	c.UserId = ${userId}
	GROUP BY cp.Id ,p.Id, p.Name, cp.Amount ,pp.Id, pp.Price, pp.CreatedAt, p.MainImage , slcl.SoConLai, p.Amount 
          ,cp.UpdateAt
	HAVING pp.CreatedAt >= ALL (
				SELECT  CreatedAt
				FROM 	ProductPrice 
				WHERE	p.Id  = ProductPrice.ProductId 
				)
  ORDER BY cp.UpdateAt DESC`;
};
exports.qGetCartId = (userId) => {
  return `SELECT Id FROM Cart WHERE UserId = ${userId}`;
};
exports.qGetCartById = (id) => {
  return `SELECT * FROM Cart WHERE Id = ${id}`;
};
exports.qAddCartItem = (cartId, productId, amount) => {
  return `EXECUTE proc_Cart_AddItem ${cartId}, ${productId}, ${amount}`;
};
exports.qUpdateCartItem = (id, amount) => {
  return `EXECUTE proc_Cart_UpdateItem ${id}, ${amount}`;
};
exports.qGetCartProductById = (id) => {
  return `SELECT * FROM CartProduct WHERE Id = ${id}`;
};
exports.qGetCartProductByProductId = (productId, userId) => {
  return `SELECT cp.Id 
          FROM	Cart c JOIN CartProduct cp ON c.Id = cp.CartId 
                JOIN [User] u ON u.Id = c.UserId  
          WHERE cp.ProductId = ${productId} AND u.Id = ${userId}`;
};
exports.qDeleteCartProductById = (id) => {
  return `DELETE FROM CartProduct WHERE Id= ${id}`;
};
// Auth
exports.qSignUp = (username, email, password) => {
  return `INSERT INTO [User] (Username, Password, Email, [Role]) 
  VALUES ('${username}', '${password}', '${email}', 0)`;
};

// Voucher
exports.qGetAllVoucher = (page, pageSize, status) => {
  if (page && pageSize) {
    return `EXECUTE proc_Voucher_Getall ${page}, ${pageSize}, ${
      status || 'NULL'
    }`;
  } else {
    return `SELECT * FROM Voucher WHERE IsDelete = 0 AND status = 1`;
  }
};

exports.qFindVoucherById = (id) => {
  if (/^\d+$/.test(id)) return `SELECT * FROM Voucher WHERE Id = ${id}`;
  else return `SELECT * FROM Voucher WHERE Code = '${id}'`;
};

exports.qFindVoucherByCode = (code) => {
  return `SELECT * FROM Voucher WHERE Code = '${code}'`;
};

exports.qCheckVoucherUserUsed = (userId, voucherId) => {
  return `SELECT 	* 
  FROM 	Voucher v
      JOIN [Order] o ON o.VoucherId = v.Id 
  WHERE	v.Id = ${voucherId} AND o.UserId = ${userId}`;
};

exports.qAddVoucher = (code, expired, amount, value, createBy) => {
  // return `EXECUTE proc_Voucher_Add '${code}', '${expired}', ${amount}, ${value}, ${createBy}`;
  return `INSERT INTO Voucher(Code, Expired, Amount, Value, CreatedBy, UpdatedBy)
  OUTPUT Inserted.ID
  Values ('${code}', '${expired}', ${amount}, ${value}, ${createBy}, ${createBy})`;
};

exports.qUpdateVoucher = (
  id,
  status,
  value,
  amount,
  expired,
  type,
  updateBy
) => {
  return `EXECUTE proc_Voucher_Update ${id}, ${status || 'NULL'}, ${
    value || 'NULL'
  }, ${amount || 'NULL'}, ${expired || 'NULL'}, ${type || 'NULL'}, ${updateBy}`;
};

exports.qDeleteVoucher = (id) => {
  return `EXECUTE proc_Voucher_Delete ${id}`;
};

// Product
// exports.qGetProductById = (id) => {
//   return `SELECT * FROM Product WHERE Id = ${id}`;
// };

// Feedback
exports.qGetFeedBackByProductAndOrder = (orderId, productId) => {
  return `SELECT * FROM Feedback WHERE OrderId=${orderId} AND ProductId=${productId}`;
};
exports.qGetAllFeedbackProduct = (productId) => {
  return `SELECT 	u.Username, u.Avatar, f.Id, f.Stars, f.Comment, f.[Date]
  FROM Feedback AS f
      JOIN [Order] AS o ON f.OrderId = o.Id 
      JOIN [User] AS u On o.UserId = u.Id 
  WHERE	f.ProductId = ${productId}`;
};
exports.qGetAllFeedback = () => {
  return `SELECT * FROM Feedback`;
};
exports.qAddFeedback = (orderId, productId, stars, comment) => {
  // return `EXECUTE proc_Feedback_Add ${orderId}, ${productId}, ${stars}, N'${comment}'`;
  if (!comment) comment = 'NULL';
  else comment = `N'${comment}'`;
  return `IF EXISTS 
  (SELECT * FROM OrderDetail
  WHERE OrderId=${orderId} AND ProductId=${productId})
  AND NOT EXISTS 
  (SELECT * FROM Feedback
  WHERE OrderId=${orderId} AND ProductId=${productId})
BEGIN 
  INSERT INTO Feedback (OrderId, ProductId, Stars, Comment)
  OUTPUT Inserted.ID
  Values (${orderId}, ${productId}, ${stars},  ${comment})		
END`;
};
exports.qAddImageFeedback = (feedbackId, path) => {
  return `INSERT INTO FeedbackImages (FeedbackId, [Path])
  VALUES (${feedbackId}, '${path}')`;
};

// Order
exports.qGetAllOrder = (page, pageSize, type) => {
  return `EXECUTE proc_Order_Getall ${page}, ${pageSize}, ${type || 'NULL'}`;
};
exports.qGetAllOrderOfUser = (userId, page, pageSize, type) => {
  return `EXECUTE proc_Order_Getall_User ${userId}, ${page}, ${pageSize}, ${
    type || 'NULL'
  }`;
};
exports.qGetOrderProduct = (orderId) => {
  return `EXECUTE proc_Order_Get_Product ${orderId}`;
};
exports.qGetOrderById = (id) => {
  return `SELECT * FROM Order WHERE Id = ${id}`;
};
exports.qGetOrderNotConfirm = (id) => {
  return `SELECT 	*
  FROM 	[Order] o 
      JOIN Status s ON o.StatusId = s.Id 
  WHERE  o.Id = ${id} AND	s.[Type] = 1`;
};
exports.qConfirmOrder = (id) => {
  return `EXECUTE proc_Order_Confirm ${id}`;
};
exports.qCancelOrder = (id) => {
  return `EXECUTE proc_Order_Cancel ${id}`;
};
exports.qGetOrderDetail = (orderId, productId) => {
  return `SELECT * FROM OrderDetail WHERE OrderId=${orderId} AND ProductId=${productId}`;
};
exports.qAddOrder = (voucherId, userId, userAddressId, ship, value) => {
  const q = `INSERT INTO [Order] (VoucherId, UserId, UserAddressId, Ship, Value)
  OUTPUT Inserted.ID
  Values (${voucherId || 'NULL'}, ${userId}, ${userAddressId}, ${
    ship || 'NULL'
  }, ${value})`;
  return q;
};

exports.qAddOrderDetail = (orderId, productId, productPriceId, quantity) => {
  return `EXECUTE proc_OrderDetail_Add ${orderId}, ${productId}, ${productPriceId}, ${quantity}`;
};

// Product
exports.qGetAllProduct = (categoryId, filter, key, page, pageSize) => {
  return `EXECUTE proc_Product_GetAll ${categoryId || 'NULL'}, ${
    filter || 'NULL'
  }, ${key || 'NULL'}, ${page}, ${pageSize}`;
};
exports.qGetAllProductAdmin = (categoryId, filter, key, page, pageSize) => {
  return `EXECUTE proc_Product_GetAll_Admin ${categoryId || 'NULL'}, ${
    filter || 'NULL'
  }, ${key || 'NULL'}, ${page}, ${pageSize}`;
};
exports.qCountProduct = (categoryId, key) => {
  const q = `EXECUTE proc_Product_Count ${categoryId || 'NULL'} ,${
    key ? "N'" + key + "' " : 'NULL'
  }`;
  return q;
};
exports.qGetProductById = (productId) => {
  return `EXECUTE proc_Product_Get ${productId}`;
};
exports.qGetProductByName = (productName) => {
  return `SELECT * FROM Product WHERE Name = ${productName}`;
};
exports.qGetProductImage = (productId) => {
  return `SELECT * FROM ProductImages WHERE ProductId = ${productId}`;
};
exports.qGetProductFeedback = (productId) => {
  return `SELECT * FROM Feedback WHERE ProductId = ${productId}`;
};
exports.qGetProductCategory = (productId) => {
  return `SELECT 	c.Id, c.Name 
  FROM 	Category c 
      JOIN ProductCategory pc ON c.Id = pc.CategoryId  
      JOIN Product p ON p.Id = pc.ProductId 
  WHERE	p.Id = ${productId}`;
};
exports.qGetFeedbackImage = (feedbackId) => {
  return `SELECT * FROM FeedbackImages Where FeedbackId = ${feedbackId}`;
};
exports.qAddProduct = (
  name,
  weight,
  time,
  size,
  shortDesc,
  playersSuggest,
  players,
  origin,
  mainImage,
  description,
  categoryId,
  brand,
  amount,
  ageSuggest
) => {
  return `INSERT INTO Product(
    ${name ? ',Name' : ''}
    ${weight ? ',Weigth' : ''}
    ${time ? ',Time' : ''}
    ${size ? ',Size' : ''}
    ${shortDesc ? ',ShortDesc' : ''}
    ${playersSuggest ? ',PlayersSuggest' : ''}
    ${players ? ',Players' : ''}
    ${origin ? ',Origin' : ''}
    ${mainImage ? ',MainImage' : ''}
    ${description ? ',Description' : ''}
    ${categoryId ? ',CategoryId' : ''}
    ${brand ? ',Brand' : ''}
    ${amount ? ',Amount' : ''}
    ${ageSuggest ? ',AgeSuggest' : ''})
    VALUES (${name ? name + ',' : ''} ${weight ? weight + ',' : ''} 
    ${time ? time + ',' : ''} ${size ? size + ',' : ''} ${
    shortDesc ? shortDesc + ',' : ''
  }
    ${playersSuggest ? playersSuggest + ',' : ''} ${
    players ? players + ',' : ''
  } ${origin ? origin + ',' : ''} ${mainImage ? mainImage + ',' : ''} ${
    description ? description + ',' : ''
  } ${categoryId ? categoryId + ',' : ''}
  ${brand ? brand + ',' : ''} ${amount ? amount + ',' : ''} ${
    ageSuggest ? ageSuggest + ',' : ''
  })`;
};
exports.qUpdateProduct = (
  id,
  name,
  players,
  playersSuggest,
  time,
  ageSuggest,
  categoryId,
  mainImage,
  shortDesc,
  description,
  brand,
  origin,
  weight,
  size,
  amount
) => {
  return `proc_Product_Update ${
    (id,
    name,
    players,
    playersSuggest,
    time,
    ageSuggest,
    categoryId,
    mainImage,
    shortDesc,
    description,
    brand,
    origin,
    weight,
    size,
    amount)
  }`;
};
exports.qDeleteProduct = (id) => {
  return `proc_Product_Delete ${id}`;
};

// Category
exports.qGetAllCategory = () => {
  return `SELECT Id, Name From Category WHERE IsDelete = 0`;
};
exports.qGetCategoryByName = (name) => {
  return `SELECT * FROM Category WHERE Name = '${name}'`;
};
exports.qGetCartegoryById = (id) => {
  return `SELECT * FROM Category WHERE Id = ${id}`;
};
exports.qAddCategory = (name) => {
  return `INSERT INTO Category(Name) VALUES (N'${name}')`;
};
exports.qUpdateCategory = (id, name) => {
  return `UPDATE Category SET Name = N'${name}', UpdatedAt = GETDATE()
    WHERE Id = ${id}`;
};
exports.qDeleteCategory = (id, name) => {
  return `UPDATE Category SET IsDelete = 1, UpdatedAt = GETDATE()
  WHERE Id = ${id}`;
};
