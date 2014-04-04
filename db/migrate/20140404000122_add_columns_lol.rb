class AddColumnsLol < ActiveRecord::Migration
  def change
    add_column :reviews, :tags, :string
  end
end
