const fs = require('fs/promises');
const path = require('path');

const primaryPath = path.join(__dirname, 'DB.json');
const rootPath = path.join(__dirname, '..', 'DB.json');

async function getFilePath() {
  try {
    await fs.access(primaryPath);
    return primaryPath;
  } catch {
    return rootPath;
  }
}

const readProducts = async () => {
  const filePath = await getFilePath();
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
};

const writeProducts = async (products) => {
  const filePath = await getFilePath();
  await fs.writeFile(filePath, JSON.stringify(products, null, 2), 'utf-8');
  if (filePath !== rootPath) {
    try {
      await fs.writeFile(rootPath, JSON.stringify(products, null, 2), 'utf-8');
    } catch (e) {
    }
  }
};

module.exports = {
  readProducts,
  writeProducts
};
