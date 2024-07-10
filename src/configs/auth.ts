const isProduction = process.env.NODE_ENV === 'production' || false

const commonSetting = {
  loginEndpoint1      : '/jwt/login',
  registerEndpoint    : '/jwt/register',
  storageTokenKeyName : 'accessToken',
  onTokenExpiration   : 'refreshToken',
  isProduction        : isProduction
}

const productionSetting = {
  ...commonSetting,
  meEndpoint          : 'http://10.10.34.2:5000/api/SisUsuarios/RefreshToken',
  loginEndpoint       : 'http://10.10.34.2:5000/api/SisUsuarios/Login',
  refreshEndPoint     : 'http://10.10.34.2:5000/api/SisUsuarios/RefreshToken',
}

const developSetting = {
  ...commonSetting,
  meEndpoint          : 'http://localhost:5000/api/SisUsuarios/RefreshToken',
  loginEndpoint       : 'http://localhost:5000/api/SisUsuarios/Login',
  refreshEndPoint     : 'http://localhost:5000/api/SisUsuarios/RefreshToken',
}

const authConfig = !isProduction ? developSetting : productionSetting

export default authConfig
