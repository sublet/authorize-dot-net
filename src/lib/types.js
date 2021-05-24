const isInt = n => {
  return Number(n) === n && n % 1 === 0;
};

const isFloat = n => {
  return Number(n) === n && n % 1 !== 0;
};

const isNumber = n => {
  return isInt(n) || isFloat(n);
};

const isString = n => {
  return typeof n === 'string';
};

const isValid = n => {
  return n && n !== '';
};

const checkAllowed = (data, allowed) => {
  allowed.forEach(itm => {
    const val = data[itm.slug];
    if (itm.type === 'INTEGER' && isValid(val) && !isInt(val))
      throw new Error(`${itm.slug} must be an Integer: ${val}`);
    if (itm.type === 'FLOAT' && isValid(val) && !isNumber(val))
      throw new Error(`${itm.slug} must be an Float: ${val}`);
    if (itm.type === 'STRING' && isValid(val) && !isString(val))
      throw new Error(`${itm.slug} must be an String: ${val}`);
    if (itm.type === 'ENUM' && isValid(val) && itm.values.indexOf(val) < 0)
      throw new Error(
        `${itm.slug} must be one of the following: ${itm.values.join(
          ', ',
        )}: ${val}`,
      );
    if (itm.isRequired && !isValid(val))
      throw new Error(`${itm.slug} is a required value`);
  });
};

module.exports = {
  checkAllowed,
  isInt,
  isFloat,
  isString,
};
