//Producction

export default {
  meEndpoint: 'http://192.168.171.210:5000/api/SisUsuarios/RefreshToken',
  loginEndpoint: 'http://192.168.171.210:5000/api/SisUsuarios/Login',
  refreshEndPoint:'http://192.168.171.210:5000/api/SisUsuarios/RefreshToken',
  loginEndpoint1: '/jwt/login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}

//Developer

/*export default {
  meEndpoint: 'http://localhost:5000/api/SisUsuarios/RefreshToken',
  loginEndpoint: 'http://localhost:5000/api/SisUsuarios/Login',
  refreshEndPoint:'http://localhost:5000/api/SisUsuarios/RefreshToken',
  loginEndpoint1: '/jwt/login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken


}*/


