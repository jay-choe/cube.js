import { StartedTestContainer } from 'testcontainers';
import { OracleDBRunner } from '@cubejs-backend/testing-shared';
import cubejs, { CubejsApi } from '@cubejs-client/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { afterAll, beforeAll, expect, jest } from '@jest/globals';
import { pausePromise } from '@cubejs-backend/shared';
import { BirdBox, getBirdbox } from '../src';
import { DEFAULT_CONFIG, testQueryMeasure } from './smoke-tests';

describe('oracle', () => {
  jest.setTimeout(60 * 5 * 100000);
  let db: StartedTestContainer;
  let birdbox: BirdBox;
  let client: CubejsApi;

  beforeAll(async () => {
    db = await OracleDBRunner.startContainer({});
    birdbox = await getBirdbox(
        'oracle',
        {
          CUBEJS_DB_TYPE: 'oracle',

          CUBEJS_DB_HOST: db.getHost(),
          CUBEJS_DB_PORT: `${db.getMappedPort(1521)}`,
          CUBEJS_DB_NAME: 'XE',
          CUBEJS_DB_USER: 'system',
          CUBEJS_DB_PASS: 'test',

          ...DEFAULT_CONFIG,
        },
        {
          schemaDir: 'oracle/schema',
        }
    );
    client = cubejs(async () => 'test', {
      apiUrl: birdbox.configuration.apiUrl,
    });
  });

  afterAll(async () => {
    await birdbox.stop();
    await db.stop();
  });

  test('query measure', () => testQueryMeasure(client));

  test('query dimensions', async () => {
    const queryDimensions = async () => {
      const response = await client.load({
        dimensions: [
          'Orders.status',
        ],
      });

      expect(response.rawData()).toMatchSnapshot('dimensions');
    };
    await queryDimensions();

    /**
     * Running a query with 2 seconds delay
     * preAggregation has 1 second in the refreshKey
     * Gives times to trigger the action if hasn't been triggered yet.
     */
    await pausePromise(2000);
    await queryDimensions();
  });
});
