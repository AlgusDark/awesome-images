import { Box, Flex } from "@chakra-ui/core";

import { NavLink } from "components/navlink";

export const Header: React.FunctionComponent = () => {
  return (
    <Flex as="header" height="4.5rem" borderBottomWidth="1px" mb={8} px={16}>
      <Flex alignItems="center" maxWidth="1024px">
        <Flex as="nav" ml={8}>
          <>
            <Box>
              <NavLink href="/">Search</NavLink>
            </Box>
            <Box ml={8}>
              <NavLink href="/my-list">My List</NavLink>
            </Box>
          </>
        </Flex>
      </Flex>
    </Flex>
  );
};
