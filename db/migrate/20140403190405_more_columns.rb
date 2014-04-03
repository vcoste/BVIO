class MoreColumns < ActiveRecord::Migration
  def change
    add_column :reviews, :is_recommended, :boolean
    add_column :reviews, :pros, :string
    add_column :reviews, :cons, :string
    add_column :reviews, :last_modification_time, :string
    add_column :reviews, :latitude, :float
    add_column :reviews, :longitude, :float
  end
end

#is_recommended, pros, cons, last_modification_time, latitude, longitude