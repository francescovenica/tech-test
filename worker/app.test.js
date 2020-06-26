const handler = require('./handler');
const { completa, archivia } = require('./services/archiviazione');

jest.mock('./services/archiviazione', () => ({
  completa: jest.fn(),
  archivia: jest.fn()
}))

describe('archivio', () => {

  const connectionId = 'my-id';

  let cache = {
    [`${connectionId}_punteggio`]: 0,
    [`${connectionId}_inProgress`]: {}
  };

  const sendMock = jest.fn();
  const cacheMockSet = jest.fn();
  const cacheMockGet = jest.fn();

  const wsMock = {
    send: sendMock
  }

  const cacheMock = {
    set: (key, value) => cache[key] = value,
    get: key => cache[key],
    del: () => { cache = {} }
  }

  afterEach(() => {
    jest.clearAllMocks();
  })

  it('deve tornare un errore se il messaggio non è un oggetto', async () => {

    await handler(wsMock, cacheMock, connectionId, 'message');

    const sentObject = JSON.parse(sendMock.mock.calls[0][0]);

    expect(sentObject.type).toBe('error');
    expect(sentObject.message).toBe('parsing_error');

  });

  it('deve archiviare il pacchetto', async () => {

    await handler(wsMock, cacheMock, connectionId, JSON.stringify({
      type: 'archiviazione',
      peso: 1
    }));

    const sentObject = JSON.parse(sendMock.mock.calls[0][0]);
    expect(sentObject.message).toBe('peso_archiviato');
  });

  it('deve tornare too busy', async () => {

    cache[`${connectionId}_inProgress`] = {
      'aa': {},
      'ab': {},
      'bb': {},
    }

    await handler(wsMock, cacheMock, connectionId, JSON.stringify({
      type: 'archiviazione',
      peso: 1
    }));

    const sentObject = JSON.parse(sendMock.mock.calls[0][0]);
    expect(sentObject.message).toBe('too_busy');
  });

  it('deve inizializzare', async () => {

    cache[`${connectionId}_inProgress`] = {
      'aa': {},
      'ab': {},
      'bb': {},
    }

    await handler(wsMock, cacheMock, connectionId, JSON.stringify({
      type: 'init'
    }));

    expect(cache[`${connectionId}_punteggio`]).toBe(0);
    expect(Object.keys(cache[`${connectionId}_inProgress`])).toHaveLength(0);
  });

  it('deve salvare', async () => {

    completa.mockReturnValueOnce({ data: { punteggi: [ { name: 'test', punteggio: 'test' } ] } });

    cache[`${connectionId}_inProgress`] = {
      'aa': {},
      'ab': {},
      'bb': {},
    }

    await handler(wsMock, cacheMock, connectionId, JSON.stringify({
      type: 'salvataggio'
    }));


    const sentObject = JSON.parse(sendMock.mock.calls[0][0]);
    expect(sentObject.message).toBe('partita_salvata');
    expect(sentObject.punteggi).toHaveLength(1)

  });

});