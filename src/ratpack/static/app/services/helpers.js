export const stepIcon = (stepName: string): string => {
  switch (stepName.substr(0, 6)) {
    case 'insert':
      return 'playlist_add';
    case 'reques':
      return 'http';
    case 'select':
      return 'view_list';
    default:
      return 'bug_report';
  }
};

export const stepLabel = (stepName: string): string => {
  switch (stepName.substr(0, 6)) {
    case 'insert':
      return 'INSERT';
    case 'reques':
      return 'REQUEST';
    case 'select':
      return 'SELECT';
    default:
      return 'ERROR';
  }
};