import { CloseIcon } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/react';
import React from 'react';

const UserBadge = ({ user, handleFunction }) => {
  return (
    <Box
      px={2}
      py={2}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      color="white"
      backgroundColor="blue"
      cursor="pointer"
      onClick={handleFunction}
    >
      {user.name}
      <CloseIcon pl={2} />
    </Box>
  );
};

export default UserBadge;
