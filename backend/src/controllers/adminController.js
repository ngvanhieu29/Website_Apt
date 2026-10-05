import jwt from 'jsonwebtoken';

export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: 'Vui lòng nhập username và password',
      });
    }

    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        message: 'Username hoặc password không đúng',
      });
    }

    const token = jwt.sign(
      {
        username,
        role: 'admin',
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    res.json({
      message: 'Đăng nhập Admin thành công',
      token,
      admin: {
        username,
        role: 'admin',
      },
    });
  } catch (error) {
    console.error('ADMIN LOGIN ERROR:', error);

    res.status(500).json({
      message: error.message,
    });
  }
};