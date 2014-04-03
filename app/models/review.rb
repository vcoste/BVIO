class Review < ActiveRecord::Base
  attr_accessor :longitude, :latitude

  belongs_to :author
  belongs_to :product

  # number of reviews, average rating, satisfaction

  def self.get_avg_rating(reviewArray)
  	ratingSum = 0
  	reviewArray.each { |r| ratingSum += r.rating }
  	avg = ratingSum/reviewArray.length
  	return avg
  end

  def self.get_number_of_reviews(reviewArray)
  	return reviewArray.length
  end

  def self.get_satisfaction(reviewArray)
  	satisfactionSum = 0
  	reviewArray.each { |r| satisfactionSum += r.is_recommended }
  	satisfaction = (satisfactionSum/reviewArray.length) * 100 #return a percentage
  	return satisfaction
  end

  def self.get_helpfulness(reviewArray)
  	helpfulnessSum = 0
  	totalHelpfulness = 0
  	reviewArray.each { |r| 
  	  if r.nil?
  			# do not count (should be NULL)
	  else
	  	totalHelpfulness ++
	  	helpfulnessSum += r.helpfulness
	  end
  	}
  	helpfulness = (helpfulnessSum/totalHelpfulness) * 100 #return a percentage
  	return helpfulness
  end

end
