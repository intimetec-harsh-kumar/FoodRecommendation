export interface IFoodItem {
	id?: number;
	item_name: string;
	price: number;
	availability_status: boolean;
	meal_type_id: number;
	food_type: string;
	spice_level: string;
	originality: string;
	is_sweet: boolean;
}
