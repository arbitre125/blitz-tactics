class Level < ActiveRecord::Base
  has_many :level_attempts

  validates_presence_of :slug
  validates_presence_of :secret_key
  validate :require_unique_puzzle_ids

  before_validation :set_secret_key


  def name
    slug.gsub('-', ' ').capitalize
  end

  def next_level
    Level.find(id + 1)
  end

  def puzzles
    # TODO better way of ensuring order
    pz = []
    puzzle_ids.each do |id|
      pz << LichessPuzzle.find(id)
    end
    pz
  end

  private

  def set_secret_key
    self.secret_key ||= SecureRandom.hex(8)
  end

  def require_unique_puzzle_ids
    if puzzle_ids.uniq.length != puzzle_ids.length
      errors.add :puzzle_ids, "must all be unique!"
    end
  end

end
