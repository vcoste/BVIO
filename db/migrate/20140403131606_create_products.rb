class CreateProducts < ActiveRecord::Migration
  def change
    create_table :products do |t|

      t.string :category_id_str
      t.integer :category_id
      t.string :description
      t.string :product_id
      t.string :image_url
      t.string :name
      t.string :product_page_url
      t.float :average_rating
      t.string :gender_data
      t.integer :helpful_vote_count
      t.integer :not_helpful_vote_count
      t.integer :not_recommended_count
      t.integer :overall_rating_range
      t.string :rating_distribution
      t.integer :recommended_count
      t.float :effectiveness
      t.float :satisfaction
      t.integer :num_reviews

      t.timestamps
    end
  end
end
