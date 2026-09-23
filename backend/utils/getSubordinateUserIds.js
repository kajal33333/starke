const getSubordinateUserIds = async (userId) => {
    const subordinates = await User.findAll({
      where: { report_to: userId }
    });
    
    let subordinateIds = subordinates.map(user => user.id);
    
    // Recursively get subordinates of subordinates
    for (const subordinate of subordinates) {
      const subSubordinateIds = await getSubordinateUserIds(subordinate.id);
      subordinateIds = [...subordinateIds, ...subSubordinateIds];
    }
    
    return subordinateIds;
  }; 

module.exports = getSubordinateUserIds