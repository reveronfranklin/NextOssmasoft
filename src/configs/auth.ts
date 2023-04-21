

export default {
  meEndpoint: 'http://localhost:46196/api/SisUsuarios/RefreshToken',
  loginEndpoint: 'http://localhost:46196/api/SisUsuarios/Login',
  refreshEndPoint:'http://localhost:46196/api/SisUsuarios/RefreshToken',
  loginEndpoint1: '/jwt/login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
