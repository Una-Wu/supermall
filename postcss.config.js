module.exports = {
  plugins: {
    'postcss-px-to-viewport': {
      viewportWidth: 375,
      viewportHeight: 375,
      unitPrecision: 5,
      viewportUnit: 'vw',
      SelectorBlackList: ['ignore', 'tab-bar', 'tab-bar-item'],
      minPixelValue: 1,
      mediaQuery: false,
      exclude: [/TabBar/]  
    }
  }
}