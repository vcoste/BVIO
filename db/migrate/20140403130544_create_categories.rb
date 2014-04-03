class CreateCategories < ActiveRecord::Migration
  def change
    create_table :categories do |t|

      t.string :category_page_url
      t.string :category_id
      t.string :image_url
      t.string :name
      t.string :parent_id_str
      t.integer :parent_id

      t.timestamps
    end
  end
end
