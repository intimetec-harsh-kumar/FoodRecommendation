import { GenericRepository } from "./genericRepository";

export class UserRepository extends GenericRepository<any> {
	async getUserPreference(email: string): Promise<void> {
		try {
			const [row]: any = await this.pool.query(
				`select * from User U inner join Preference P on U.preference_id=P.id and U.email = ?`,
				email
			);
			return row.length > 0 ? row[0] : null;
		} catch (error) {
			throw error;
		}
	}
	async updateProfile(profileData: any): Promise<boolean> {
		try {
			const [isUserAlreadyInPreference]: any = await this.pool.query(
				`select * from Preference where user_email = ?`,
				profileData.user_email
			);
			const { user_email, ...dataToBeUpdated } = profileData;
			if (isUserAlreadyInPreference.length > 0) {
				const [row]: any = await this.pool.query(
					`update Preference set ? where user_email = ?`,
					[dataToBeUpdated, user_email]
				);
				return true;
			}
			const [row]: any = await this.pool.query(
				`insert into Preference set ?`,
				profileData
			);
			await this.pool.query(
				`update User set preference_id = ? where email = ?`,
				[row.insertId, user_email]
			);
			return true;
		} catch (error) {
			throw error;
		}
	}
}
