class CreateReviews < ActiveRecord::Migration
  def change
    create_table :reviews do |t|
      t.string :author_id_str
      t.integer :author_id
      t.string :review_id
      t.string :product_id_str
      t.integer :product_id
      t.integer :rating
      t.text :review_text
      t.string :title
      t.float :helpfulness
      t.integer :total_comment_count
      t.integer :total_feedback_count
      t.integer :total_negative_feedback_count
      t.integer :total_positive_feedback_count
      
      t.timestamps
    end
  end
end
