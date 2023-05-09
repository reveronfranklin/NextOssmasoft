

export default {
  meEndpoint: 'http://localhost:5000/api/SisUsuarios/RefreshToken',
  loginEndpoint: 'http://localhost:5000/api/SisUsuarios/Login',
  refreshEndPoint:'http://localhost:5000/api/SisUsuarios/RefreshToken',
  loginEndpoint1: '/jwt/login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
