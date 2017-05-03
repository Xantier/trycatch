type StyleObject = {
  backgroundColor: string
}

export const resultStyle = (result: boolean): StyleObject => {
  if (result) {
    return {
      backgroundColor: 'green'
    };
  }
  return {
    backgroundColor: 'yellow'
  };
};