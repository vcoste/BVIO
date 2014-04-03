class Review < ActiveRecord::Base
  attr_accessor :longitude, :latitude

  belongs_to :author
  belongs_to :product

end
