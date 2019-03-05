function MemberController($scope) {
        $scope.members = [];

        $scope.likesNodeFilter = { likesNode: true };
        $scope.hatesNodeFilter = { likesNode : false };

        $scope.setMembers = function(members) {
                $scope.members = members;
        }
}
