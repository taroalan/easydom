import easydom from '../src/index';

describe('easydom api', () => {
  it('API methods', () => {
    const methods = Object.keys(easydom);
    console.log(methods);

    expect(methods.length).toBe(5);
    expect(methods).toContain('createElement');
    expect(methods).toContain('createDOM');
    expect(methods).toContain('render');
    expect(methods).toContain('diff');
    expect(methods).toContain('patch');
  });

  it('With a createElement function', () => {
    const { createElement } = easydom;

    expect(createElement).toBeInstanceOf(Function);
  });
});
