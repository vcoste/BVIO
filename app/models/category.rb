class Category < ActiveRecord::Base

	has_many :children, :class_name => "Category", :foreign_key => "parent_id"
	belongs_to :parent, :class_name => "Category"

	def self.to_tree
	puts @children
    {
    	"category_id" => @category_id,
      	"subCategory"   => @children.map { |c| c.to_tree }
    }
  end

end
