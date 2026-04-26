describe('Test', () => {
  test('what is vi', () => {
    console.log('VI is:', typeof vi);
    if (typeof vi !== 'undefined') {
       console.log('VI keys:', Object.keys(vi));
    }
  });
});
