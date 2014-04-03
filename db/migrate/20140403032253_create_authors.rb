class CreateAuthors < ActiveRecord::Migration
  def change
    create_table :authors do |t|

      t.string :gender
      t.string :author_id
      t.string :location
      t.string :username
      t.float :location_latitude
      t.float :location_longitude

      t.timestamps
    end
  end
end
