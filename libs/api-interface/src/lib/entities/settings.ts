import dayjs from 'dayjs';

export interface Settings {
  /**
   * UUID of the settings.
   */
  id: string;

  /**
   * The date the settings were created.
   */
  createdAt: dayjs.Dayjs;

  /**
   * The date the settings were last updated.
   */
  updatedAt: dayjs.Dayjs;

  /**
   * `true` if the results should be published, `false` otherwise.
   */
  publishResults: boolean;
}
