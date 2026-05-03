const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// Strip all common emojis
const emojiRegex = /[\u{1F300}-\u{1F5FF}\u{1F900}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F004}\u{1F0CF}\u{1F18E}\u{1F201}-\u{1F251}\u{2B50}\u{2122}\u{2328}\u{231A}\u{231B}\u{23E9}-\u{23EC}\u{23F0}\u{23F3}\u{25B6}\u{23FA}\u{200D}]/gu;
code = code.replace(emojiRegex, '');

// Clean up weird spaces left behind (like "  " to " ")
code = code.replace(/  +/g, ' ');

// Remove icon wrappers
code = code.replace(/<div className="model-icon-wrap">.*?<\/div>/g, '');
code = code.replace(/<div className="cluster-emoji">.*?<\/div>/g, '');
code = code.replace(/<div className="result-emoji">.*?<\/div>/g, '');
code = code.replace(/<span className="tab-icon">.*?<\/span>/g, '');
code = code.replace(/<span className="cluster-info-icon">.*?<\/span>/g, '');

fs.writeFileSync('src/App.jsx', code);
