export const createErrorsObject = (error) => {
  let errors = error?.issues.reduce((errorsObj, issue) => {
    errorsObj[issue.path[0]] = issue.message;
    return errorsObj;
  }, {});

  return errors;
};
